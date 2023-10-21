import { SceneManager } from './shared/scene-manager';
import { LoaderScene } from './scenes/loader-scene';
import { FILL_COLOR } from './config/constants';

SceneManager.init(FILL_COLOR, 0);

const loady: LoaderScene = new LoaderScene();
SceneManager.changeScene(loady);
