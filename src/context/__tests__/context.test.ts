import { ClientContext } from "../context"

test("convert ClientContext from object and back", () => {
  const ctxObject = {
    env: "production",
    debugMode: true,
    dbTimeout: 100,
    doubleValue: 1.5,
  }
  const ctx = ClientContext.fromObject(ctxObject)
  expect(ctx.toString()).toEqual(
    new ClientContext()
      .setString("env", "production")
      .setBoolean("debug_mode", true)
      .setInt("db_timeout", 100)
      .setDouble("double_value", 1.5)
      .toString(),
  )
  expect(ctx.toObject()).toEqual(ctxObject)
})
