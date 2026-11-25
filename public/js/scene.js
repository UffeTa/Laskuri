import { mountTrustedMarkup } from './trusted-html.js';

const cache = new Map();
let poseToken = 0;

export const SCENE = {
  character: {
    id: 'beanie_beard_guy',
    name: 'Pipopäinen kaveri',
    walkUrl: '/assets/character-walk.svg',
    celebrateUrl: '/assets/character-celebrate.svg',
  },
  goal: {
    id: 'skoda_bos5',
    name: 'Musta SUV (BOS-5)',
    url: '/assets/car-bos5.svg',
  },
  environment: {
    id: 'ahlsell_yard',
    name: 'Ahlsellin piha',
    url: '/assets/yard.html',
  },
};

export function resolveScene() {
  return {
    characterId: SCENE.character.id,
    goalId: SCENE.goal.id,
    environmentId: SCENE.environment.id,
  };
}

export async function loadText(url) {
  if (cache.has(url)) return cache.get(url);
  const response = await fetch(url);
  if (!response.ok) throw new Error(url);
  const text = await response.text();
  cache.set(url, text);
  return text;
}

export async function renderScene(nodes) {
  const [yard, car, walk] = await Promise.all([
    loadText(SCENE.environment.url),
    loadText(SCENE.goal.url),
    loadText(SCENE.character.walkUrl),
  ]);
  mountTrustedMarkup(nodes.stageEnvironment, yard);
  mountTrustedMarkup(nodes.stageGoal, car);
  mountTrustedMarkup(nodes.stageCharacter, walk);
  nodes.stageCharacter.dataset.pose = 'walk';
  nodes.stageCharacter.dataset.poseKey = 'walk:';
  if (nodes.metaCharacter) nodes.metaCharacter.textContent = SCENE.character.name;
  if (nodes.metaGoal) nodes.metaGoal.textContent = SCENE.goal.name;
  if (nodes.metaEnvironment) nodes.metaEnvironment.textContent = SCENE.environment.name;
}

export function applyDanceClass(element, dance, dances) {
  applyPerformanceClasses(element, dance, dances, 'dance');
}

export function applyPerformanceClasses(element, dance, dances, mood) {
  for (const item of dances) {
    if (item.rootClass) element.classList.remove(item.rootClass);
    if (item.walkClass) element.classList.remove(item.walkClass);
  }
  element.dataset.danceId = dance && dance.id ? dance.id : '';
  if (!dance) return;
  if (mood === 'dance' && dance.rootClass) element.classList.add(dance.rootClass);
  else if ((mood === 'walk' || mood === 'cheerful') && dance.walkClass) {
    element.classList.add(dance.walkClass);
  }
}

export async function setCharacterPose(stageCharacter, pose, dance) {
  const danceId = pose === 'dance' && dance ? dance.id : '';
  const key = `${pose}:${danceId}`;
  if (stageCharacter.dataset.poseKey === key) return;
  const token = ++poseToken;
  stageCharacter.dataset.poseKey = key;
  let url = SCENE.character.walkUrl;
  if (pose === 'celebrate') url = SCENE.character.celebrateUrl;
  if (pose === 'dance') url = dance.svgUrl;
  try {
    const svg = await loadText(url);
    if (token !== poseToken) return;
    mountTrustedMarkup(stageCharacter, svg);
    stageCharacter.dataset.pose = pose;
  } catch (error) {
    if (token === poseToken) stageCharacter.dataset.poseKey = '';
    throw error;
  }
}
