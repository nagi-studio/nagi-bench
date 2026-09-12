/** 把 import 'three' 重定向到本地替身，用于在 Node 里跑渲染层代码。 */
import { register } from 'node:module';

register('./resolver.mjs', import.meta.url);
