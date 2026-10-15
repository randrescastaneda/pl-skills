const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn, execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..', '..', 'skills', 'pl-clear-technical-communication');
const option = (name, fallback) => {
  const index = process.argv.indexOf(`--${name}`);
  if (index < 0) return fallback;
  if (!process.argv[index + 1] || process.argv[index + 1].startsWith('--')) {
    throw new Error(`Missing value for --${name}`);
  }
  return process.argv[index + 1];
};
const cli = option('cli', process.env.KILO_EVAL_CLI || 'kilo');
const model = option('model', null);
const variant = option('variant', null);
const agents = option('agents', 'code,ask,debug').split(',');
const selected = option('cases', '').split(',').filter(Boolean);
const concurrency = Number(option('concurrency', '3'));
const timeout = Number(option('timeout', '240000'));
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 8 ||
    !Number.isFinite(timeout) || timeout < 1000) {
  throw new Error('Use concurrency 1..8 and a positive timeout of at least 1000 ms.');
}
const suiteFile = path.resolve(__dirname, option('suite', 'cases.json'));
const allCases = JSON.parse(fs.readFileSync(suiteFile, 'utf8'));
for (const id of selected) {
  if (!allCases.some(test => test.id === id)) throw new Error(`Unknown case: ${id}`);
}
const cases = allCases.filter(test => !selected.length || selected.includes(test.id));
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const output = path.resolve(option('output', path.join(__dirname, 'results', stamp)));
if (require.main === module && fs.existsSync(output)) throw new Error(`Refusing to overwrite results: ${output}`);
if (require.main === module) fs.mkdirSync(output, { recursive: true });
const scratchParent = require.main === module
  ? fs.mkdtempSync(path.join(os.tmpdir(), 'kilo-communication-eval-')) : null;
const skillName = 'pl-clear-technical-communication';
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

function invoke(args, cwd) {
  return new Promise(resolve => {
    const child = spawn(cli, args, {
      cwd,
      windowsHide: true,
      env: { ...process.env, KILO_CLIENT: 'cli', KILO_PLATFORM: 'cli' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let spawnError = null;
    const timer = setTimeout(() => {
      timedOut = true;
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { windowsHide: true });
      } else {
        child.kill('SIGTERM');
      }
    }, timeout);
    child.stdout.on('data', chunk => { stdout += chunk.toString(); });
    child.stderr.on('data', chunk => { stderr += chunk.toString(); });
    child.on('error', error => { spawnError = error.message; });
    child.on('close', code => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut, spawnError });
    });
  });
}

function decode(stdout) {
  const events = [];
  const unparsed = [];
  for (const line of stdout.split(/\r?\n/).filter(Boolean)) {
    try { events.push(JSON.parse(line)); } catch { unparsed.push(line); }
  }
  return { events, unparsed };
}

function inspect(events, expectInvocation) {
  const calls = events.filter(event => event.type === 'tool_use');
  const skillCalls = calls.filter(event => event.part?.tool === 'skill' &&
    event.part.state?.input?.name === skillName);
  const successful = skillCalls.filter(event => event.part.state?.status === 'completed' &&
    event.part.state?.output?.includes(`<skill_content name="${skillName}">`));
  const texts = events.filter(event => event.type === 'text' && event.part?.text);
  // Commentary can be emitted as a separate text part. The last text part is the final answer.
  const final = texts.at(-1)?.part.text || '';
  const contextTools = new Set(['skill', 'todowrite', 'todoread', 'read', 'glob', 'grep',
    'list', 'webfetch', 'websearch', 'board_read']);
  const firstSkill = events.findIndex(event => successful.includes(event));
  const skillEnd = successful[0]?.part.state?.time?.end;
  const boundaries = events.filter(event => event.type === 'text' ||
    (event.type === 'tool_use' && !contextTools.has(event.part?.tool)));
  const ordered = !expectInvocation || firstSkill >= 0 && boundaries.every(event => {
    const start = event.type === 'text' ? event.part?.time?.start : event.part?.state?.time?.start;
    return Number.isFinite(skillEnd) && Number.isFinite(start)
      ? skillEnd <= start : firstSkill < events.indexOf(event);
  });
  const ending = final.match(/\*\*Next:\*\*\s*([^\n]+)\s*\n\s*\*\*Need from you:\*\*\s*([^\n]+)\s*$/);
  return {
    final,
    toolEvidence: calls.map(event => ({
      timestamp: event.timestamp,
      sessionID: event.sessionID,
      callID: event.part.callID,
      tool: event.part.tool,
      status: event.part.state?.status,
      input: event.part.state?.input,
    })),
    skillCalls: skillCalls.length,
    successfulSkillCalls: successful.length,
    activationPass: expectInvocation ? successful.length === 1 : skillCalls.length === 0,
    beforeExplanationOrWork: ordered,
    preActivationContextTools: events.slice(0, firstSkill < 0 ? events.length : firstSkill)
      .filter(event => event.type === 'tool_use' && contextTools.has(event.part?.tool) &&
        event.part?.tool !== 'skill')
      .map(event => event.part.tool),
    mandatoryEndingPass: Boolean(ending),
    next: ending?.[1] || null,
    needFromUser: ending?.[2] || null,
    hiddenDepthNamesPass: !/\b(?:minimal|standard|detailed) (?:level|depth)\b/i.test(final),
    errors: events.filter(event => event.type === 'error').map(event =>
      event.error?.data?.message || event.error?.message || event.error?.name || 'Unknown error'),
  };
}

async function evaluate(agent, test) {
  const id = `${agent}-${test.id}`;
  const directory = path.join(output, id);
  const scratch = path.join(scratchParent, id);
  fs.mkdirSync(directory);
  fs.mkdirSync(scratch);
  let originalTestSource;
  for (const [name, content] of Object.entries(test.fixtures || {})) {
    const target = path.resolve(scratch, name);
    if (path.dirname(target) !== scratch || typeof content !== 'string') {
      throw new Error(`Fixture must be a text file in its isolated case folder: ${name}`);
    }
    fs.writeFileSync(target, content);
  }
  if (test.implementation) {
    fs.writeFileSync(path.join(scratch, 'add.cjs'), 'exports.add = (a, b) => a - b;\n');
    originalTestSource =
      "const assert = require('node:assert/strict');\nconst { add } = require('./add.cjs');\n" +
      "assert.equal(add(2, 3), 5);\nassert.equal(add(-2, 2), 0);\nconsole.log('2 assertions passed');\n";
    fs.writeFileSync(path.join(scratch, 'test.cjs'), originalTestSource);
  }
  const result = {
    id, agent, case: test.id, technical: test.technical,
    handoffState: test.handoffState || null, criteria: test.criteria, turns: [],
  };
  let sessionID;
  let previouslyLoaded = false;
  for (const [index, prompt] of test.turns.entries()) {
    const args = ['run', '--agent', agent, '--format', 'json'];
    if (model) args.push('--model', model);
    if (variant) args.push('--variant', variant);
    if (sessionID) args.push('--session', sessionID);
    args.push(prompt);
    const raw = await invoke(args, scratch);
    const decoded = decode(raw.stdout);
    sessionID = decoded.events.find(event => event.sessionID)?.sessionID || sessionID;
    const expectInvocation = test.technical && index === 0 && !previouslyLoaded;
    const checks = inspect(decoded.events, expectInvocation);
    const unexplainedNothingPass = !test.handoffState || test.handoffState === 'complete' ||
      !/^(?:nothing|nada)[.!]?$/i.test(checks.needFromUser?.trim() || '');
    previouslyLoaded ||= checks.successfulSkillCalls > 0;
    // Store tool events, not provider error headers or credentials.
    const safeEvents = decoded.events.map(event => event.type === 'error'
      ? { type: 'error', timestamp: event.timestamp, sessionID: event.sessionID,
          error: { name: event.error?.name, message: event.error?.data?.message || 'Unknown error' } }
      : event);
    fs.writeFileSync(path.join(directory, `turn-${index + 1}.events.json`), JSON.stringify(safeEvents, null, 2) + '\n');
    fs.writeFileSync(path.join(directory, `turn-${index + 1}.response.txt`), checks.final + '\n');
    const infrastructurePass = raw.code === 0 && !raw.timedOut && !raw.spawnError &&
      checks.errors.length === 0 && checks.final.length > 0;
    result.turns.push({
      prompt, sessionID, exitCode: raw.code, timedOut: raw.timedOut,
      spawnError: raw.spawnError, infrastructurePass, ...checks,
      unexplainedNothingPass,
      deterministicChecksPass: infrastructurePass && checks.activationPass &&
        checks.beforeExplanationOrWork && checks.mandatoryEndingPass && checks.hiddenDepthNamesPass &&
        unexplainedNothingPass,
      qualitativeReview: 'PENDING: accuracy, prose, ownership, continuation evidence, user duties, and prompt completeness require semantic review.',
    });
    if (!infrastructurePass) break;
  }
  if (test.implementation) {
    try {
      const testFileUnchanged = fs.readFileSync(path.join(scratch, 'test.cjs'), 'utf8') === originalTestSource;
      result.fixtureVerification = {
        pass: testFileUnchanged,
        testFileUnchanged,
        output: execFileSync(process.execPath, ['-e', originalTestSource], { cwd: scratch, encoding: 'utf8' }).trim(),
        source: fs.readFileSync(path.join(scratch, 'add.cjs'), 'utf8'),
      };
    } catch (error) {
      result.fixtureVerification = { pass: false, output: String(error.stderr || error.message) };
    }
  }
  fs.writeFileSync(path.join(directory, 'checks.json'), JSON.stringify(result, null, 2) + '\n');
  const casePass = result.turns.every(turn => turn.deterministicChecksPass) && result.fixtureVerification?.pass !== false;
  console.log(`${id}: ${casePass ? 'STRUCTURAL PASS' : 'CHECK FAILED'} (${result.turns.map(turn => `${turn.successfulSkillCalls} skill loads`).join(', ')})`);
  return result;
}

async function main() {
  const version = await invoke(['--version'], scratchParent);
  const agentList = await invoke(['agent', 'list'], scratchParent);
  const availableAgents = [...agentList.stdout.matchAll(/^([a-z-]+) \(primary\)\r?$/gm)]
    .map(match => match[1]);
  for (const agent of agents) {
    if (!availableAgents.includes(agent)) throw new Error(`Unknown primary agent: ${agent}`);
  }
  const discoveryRaw = await invoke(['debug', 'skill'], scratchParent);
  let discovery;
  try {
    const list = JSON.parse(discoveryRaw.stdout);
    const found = list.find(skill => skill.name === skillName);
    discovery = found ? { name: found.name, location: found.location, trusted: found.trusted } : null;
  } catch { discovery = null; }
  const manifest = {
    startedAt: new Date().toISOString(), cli, cliVersion: version.stdout.trim(), model, variant,
    agents, availableAgents, concurrency, timeout, skillSHA256: sha256(path.join(root, 'SKILL.md')),
    suiteFile, casesSHA256: sha256(suiteFile),
    runnerSHA256: sha256(__filename),
    referenceSHA256: Object.fromEntries(fs.readdirSync(path.join(root, 'references'))
      .filter(file => file.endsWith('.md'))
      .map(file => [file, sha256(path.join(root, 'references', file))])),
    globalInstructionsSHA256: sha256(path.join(os.homedir(), '.config', 'kilo', 'AGENTS.md')),
    discovery, scratchParent,
    limits: [
      'Classification is inferred from activation and behavior, not hidden reasoning.',
      'Structural checks do not establish technical accuracy or prose quality.',
      'Read-only context tools may complete before skill loading; output/execution/edit boundaries remain guarded. Ambiguous progress text needs semantic review.',
      'Ordering uses skill completion and operation/text start timestamps when available, with event-order fallback otherwise.',
      'The bare-Nothing check is only a negative guard; semantic handoff correctness requires independent review.',
      'Continuation fixtures describe hypothetical verified states; they do not verify real scheduler callbacks.',
      'A final answer is the last emitted text part; inspect exports if part segmentation changes.',
      'CLI runs create fresh sessions; follow-up turns reuse a recorded session ID.',
      'No permission, provider, agent prompt, or project config is modified by this runner.',
    ],
  };
  fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  if (!discovery) throw new Error('Skill not discovered in a fresh CLI process.');
  // Implementation requires Code mode. Other modes test reporting via cases 05 and 11.
  const jobs = agents.flatMap(agent => cases.filter(test => !test.implementation || agent === 'code')
    .map(test => ({ agent, test })));
  const results = [];
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, async () => {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      results.push(await evaluate(job.agent, job.test));
    }
  }));
  results.sort((a, b) => a.id.localeCompare(b.id));
  const turns = results.flatMap(result => result.turns);
  const summary = {
    completedAt: new Date().toISOString(), sessions: results.length, turns: turns.length,
    structuralPasses: turns.filter(turn => turn.deterministicChecksPass).length,
    structuralFailures: turns.filter(turn => !turn.deterministicChecksPass).length,
    implementationVerificationFailures: results.filter(result => result.fixtureVerification?.pass === false).length,
    skillLoads: turns.reduce((total, turn) => total + turn.successfulSkillCalls, 0),
    qualitativeReview: 'PENDING; use rubric.md and an independent reviewer.', results,
  };
  fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log(`Results: ${output}`);
  console.log(`Structural checks: ${summary.structuralPasses}/${summary.turns} turns passed. Qualitative review remains required.`);
  if (summary.structuralFailures || summary.implementationVerificationFailures) process.exitCode = 1;
}

module.exports = { inspect };
if (require.main === module) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
