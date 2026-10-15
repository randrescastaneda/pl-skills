const assert = require('node:assert/strict');
const test = require('node:test');
const { inspect } = require('./run.cjs');

const skill = {
  type: 'tool_use',
  part: {
    tool: 'skill',
    state: {
      status: 'completed',
      input: { name: 'pl-clear-technical-communication' },
      output: '<skill_content name="pl-clear-technical-communication">Synthetic unit-test content</skill_content>',
    },
  },
};
const final = { type: 'text', part: { text: 'Done.\n\n**Next:** None.\n\n**Need from you:** Nothing.' } };
const contextRead = { type: 'tool_use', part: { tool: 'read', state: { status: 'completed' } } };
const edit = { type: 'tool_use', part: { tool: 'apply_patch', state: { status: 'completed' } } };

test('successful loading before output passes', () => {
  const result = inspect([skill, final], true);
  assert.equal(result.activationPass, true);
  assert.equal(result.beforeExplanationOrWork, true);
  assert.equal(result.mandatoryEndingPass, true);
});

test('read-only context completion before skill completion is allowed and recorded', () => {
  const result = inspect([contextRead, skill, final], true);
  assert.equal(result.beforeExplanationOrWork, true);
  assert.deepEqual(result.preActivationContextTools, ['read']);
});

test('implementation before loading fails', () => {
  assert.equal(inspect([edit, skill, final], true).beforeExplanationOrWork, false);
});

test('technical output before loading fails', () => {
  assert.equal(inspect([final, skill], true).beforeExplanationOrWork, false);
});

test('completion-event order cannot hide an operation that started before loading finished', () => {
  const timedSkill = structuredClone(skill);
  timedSkill.part.state.time = { start: 10, end: 30 };
  const timedEdit = structuredClone(edit);
  timedEdit.part.state.time = { start: 20, end: 40 };
  assert.equal(inspect([timedSkill, timedEdit, final], true).beforeExplanationOrWork, false);
  const timedText = structuredClone(final);
  timedText.part.time = { start: 20, end: 40 };
  assert.equal(inspect([timedSkill, timedText], true).beforeExplanationOrWork, false);
});

test('nontechnical answer does not need activation', () => {
  const result = inspect([final], false);
  assert.equal(result.activationPass, true);
  assert.equal(result.mandatoryEndingPass, true);
});

test('a claimed invocation is not successful tool evidence', () => {
  assert.equal(inspect([{ type: 'text', part: { text: 'I used the skill.' } }, final], true).activationPass, false);
});

test('both ending fields and their final position are required', () => {
  assert.equal(inspect([{ type: 'text', part: { text: 'Done.' } }], false).mandatoryEndingPass, false);
  assert.equal(inspect([{ type: 'text', part: { text: final.part.text + '\nExtra prose.' } }], false).mandatoryEndingPass, false);
});
