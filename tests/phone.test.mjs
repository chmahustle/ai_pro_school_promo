import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPhoneInput, normalizePhone } from "../src/lib/phone.ts";

test("normalizePhone: любые варианты записи → 7XXXXXXXXXX", () => {
  const ok = "77011234567";
  for (const v of ["+7 (701) 123-45-67", "8 701 123 45 67", "87011234567", "7011234567", "+77011234567", "7 701 123-45-67", " +7(701)1234567 "]) {
    assert.equal(normalizePhone(v), ok, v);
  }
});

test("normalizePhone: некорректные номера → null", () => {
  for (const v of ["", "123", "+7 (701) 123-45", "701123456", "+7 (701) 123-45-678", "abc", "+1 650 555 0100", null, undefined]) {
    assert.equal(normalizePhone(v), null, String(v));
  }
});

test("formatPhoneInput: набор по одной цифре", () => {
  let v = "";
  const steps = [];
  for (const ch of "77011234567") {
    v = formatPhoneInput(v + ch);
    steps.push(v);
  }
  assert.equal(steps[0], "+7");
  assert.equal(steps[1], "+7 (7");
  assert.equal(steps[3], "+7 (701)");
  assert.equal(steps.at(-1), "+7 (701) 123-45-67");
});

test("formatPhoneInput: вставка целиком в разных форматах", () => {
  for (const v of ["87011234567", "+77011234567", "7011234567", "7 701 123 45 67", "+7 (701) 123-45-67"]) {
    assert.equal(formatPhoneInput(v), "+7 (701) 123-45-67", v);
  }
});

test("formatPhoneInput: лишние цифры отбрасываются, удаление до пустого поля", () => {
  assert.equal(formatPhoneInput("+7 (701) 123-45-678"), "+7 (701) 123-45-67");
  assert.equal(formatPhoneInput("+7 (701) 123-45-6"), "+7 (701) 123-45-6");
  assert.equal(formatPhoneInput("+7"), "+7");
  assert.equal(formatPhoneInput("+"), "");
  assert.equal(formatPhoneInput(""), "");
});

test("formatPhoneInput: поле уже содержит +7 (фокус), набор 10 цифр и привычная 8", () => {
  let v = "+7";
  for (const ch of "7011234567") v = formatPhoneInput(v + ch);
  assert.equal(v, "+7 (701) 123-45-67");
  v = "+7";
  for (const ch of "87011234567") v = formatPhoneInput(v + ch);
  assert.equal(v, "+7 (701) 123-45-67");
});

test("результат маски нормализуется в 11 цифр", () => {
  assert.equal(normalizePhone(formatPhoneInput("8 701 123 45 67")), "77011234567");
});
