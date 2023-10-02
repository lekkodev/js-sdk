# js-sdk
A Lekko Client JS library.

### Usage
- Clone this repo into the same parent folder as the project you want to use it.  It is not released via yarn yet.
  Run yarn build in the js sdk folder.
  Then in your package.json dependencies add "js-sdk": "file:../js-sdk" and run yarn to install it.

- Initialize the client with your API Key and repository owner and name.

```
const client = await initAPIClient({
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
