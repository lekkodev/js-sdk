# js-sdk

A Lekko Client JS library.

### Usage

- Initialize the client with your API Key and repository owner and name.

```
const client = initAPIClient({
  apiKey,
  repositoryOwner,
  repositoryName,
})
```

- Create a context

```
new ClientContext().setString('string', 'hello').setBoolean('bool', true).setInt('int', 2),
```

- Evaluate a config with the context using the proper function for the return type

```
client.getInt(namespaceName, configName, context)
```
