# SPARQL-Validator

`SPARQL-Validator` is a Github Action that checks if one or multiple `.sparql` files with a SPARQL querry inside are well formed. To check taht the action will make a query to [dbpedia](https://dbpedia.org/sparql), if the status of this query is `400`, meaning that the file is not well formed the action will fail. Independently of the result of the execution the action will put a comment in the pull request with the results of the execution.

## Usage
Create a `.github.workflows/[name].yaml` file in the repository.

Example workflow:
```
name: [name]
on:   
  pull_request:
    branches: [master]

jobs:    
  [name]:
    runs-on: ubuntu-latest
    name: [name]
    steps:

      - run: npm i follow-redirects
      
      - run: npm i fs
      
      - name: Checkout
        uses: actions/checkout@v2
      
      - name: sparql-validator
        uses: Rarycops/SPARQL-Validator@v1.0.0
        id: 'sparql-validator'
        with:
          owner: ${{ github.repository_owner }}
          repo: ${{ github.event.repository.name }}
          pr_number: ${{ github.event.number }}
          token: ${{ secrets.GITHUB_TOKEN }}
          actor: ${{ github.actor }}
          graph_uri: [uri]
          format: [format]
          path: [path]

      - name: update files and push to remote
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"

          git add -A
          git commit -m "Output ${{ github.actor }} - ${{ github.event.number }}"
          git push origin HEAD:[master] --force
```
## Inputs
### `owner`
The owner of the repository, it is taken from `${{ github.repository_owner }}`. 
### `repo`
The repository name, it is taken from `${{ github.event.repository.name }}`. 
### `pr_number`
The pull request number, it is taken from `${{ github.event.number }}`. 
### `token`
The account acces token, it is taken from `${{ secrets.GITHUB_TOKEN }}`. 
### `actor`
The account that created the pull request, it is taken from `${{ github.actor }}`. 
### `graph_uri`(optional)
The graph_uri for the [dbpedia](https://dbpedia.org) query. 
### `format`(optional)
The format of the output of the query.

| Option | Format |
| :----------- | :----------- |
| `default` | `html` |
| `application/json` | `json` |
| `application/javascript` | `javascript` |
| `application/turtle` | `turtle` |
| `text/plain` | `N-Triplets` |
| `CSV` | `csv` |
| `Spreadsheet` | `html` |
| `XML` | `xml` |
| `RDF` | `rdf` |
### `path`(optional)
The `default` path is the path where the files with the querys are stored.

The path in the parameter is set, it should look like: `SPARQL-Validator/outputs`

The path to store the outputs of the querys will look like, `[path]/[filename]-[actor].[output]`.