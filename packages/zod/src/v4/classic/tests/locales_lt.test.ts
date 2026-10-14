import { afterEach, expect, test } from "vitest";
import * as z from "zod/v4";

afterEach(() => {
  z.config(z.locales.en());
});

test("lt locale does not append 'undefined' to unitless too_big/too_small messages", () => {
  z.config(z.locales.lt());

  const messages = [
    z.number().max(5).safeParse(9),
    z.number().min(5).safeParse(1),
    z.bigint().max(5n).safeParse(9n),
    z.date().min(new Date(5)).safeParse(new Date(1)),
  ].map((r) => r.error!.issues[0].message);

  for (const message of messages) {
    expect(message).not.toContain("undefined");
  }
  expect(messages[0]).toBe("Skaičius turi būti ne didesnis kaip 5");
  expect(messages[1]).toBe("Skaičius turi būti ne mažesnis kaip 5");
});

test("lt locale keeps units for sized origins", () => {
  z.config(z.locales.lt());
  const message = z.string().max(2).safeParse("abcd").error!.issues[0].message;
  expect(message).not.toContain("undefined");
  expect(message).toMatch(/simbol/);
});
