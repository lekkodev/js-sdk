import { ClientTransportBuilder } from "../transport-builder"

test("build default transport", () => {
  const transport = new ClientTransportBuilder({
    hostname: "localhost:8080",
    apiKey: "foobar",
  }).build()
  expect(transport).not.toEqual(undefined)
})
