// Подключает хуки загрузки для тестов (node --import ./tests/register.mjs --test): модули src/data импортируются как есть.
import { register } from "node:module";
register("./hooks.mjs", import.meta.url);
