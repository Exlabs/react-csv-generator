# React CSV Generator

[![Exlabs](https://exlabs.com/wp-content/uploads/2021/06/New-Project-11.jpg)](https://exlabs.com/)

**Let's generate a CSV file on the frontend side. Efficiently and quickly with TypeScript support.**

- Customize your source of data
- Use default styles or customize it
- Use custom labels for data fields
- Generated file works well with Excel and Numbers
- ✨Magic ✨

## Features
- Generate a CSV file from the array
- Generate a CSV file from one endpoint
- Generate a CSV file from a bunch of endpoint's pages (pagination support)
- Default loader during file generation (can be replaced)
- Custom, optional fields labels
- Custom filename
- Custom messages
- TypeScript support

## Installation

```sh
npm install react-csv-generator
```

or

```sh
yarn add react-csv-generator
```

## Available Props

| Prop | Required  | Description | Example
| ------ | ------ | ------ | ------ |
| `children` | ✅ |  Content of the component|  "Download" or `<div>Download me</div>`
| `fileName` | ✅  |  Name of the generated file | "generated-file"
| `className` | ⬜️| Class name to  custom  CSS styling| "own-class"
| `baseEndpoint` | ⬜️ ✅ | URL of the endpoint. If set, you can't set `items` | "https://api.punkapi.com/v2/beers"
| `endpointDetails` | ⬜️ | Additional params for the endpoint set in `baseEndpoint` | `{ page: 1, per_page: 3 }`
| `items` | ⬜️ ✅  | Array of data ready to generate the CSV. If set, you can't set `baseEndpoint` | `[ { id: 1 }, { id: 2 } ]`
| `labels` | ⬜️ | Custom labels for fields | `{ name: 'User name', created_at: 'Created at' }`
| `objectNameInResponse` | ⬜️ | If endpoint will return data in some particular object, pass its name | "items"
| `loader` | ⬜️ | Component to replace the default loader | `<MyOwnLoader />`
| `errorMessage` | ⬜️ | Message if something goes wrong. Default value: `Something went wrong, please try again.` | "Oppps, sorry!"
| `noDataMessage` | ⬜️ | Message if there is no data to generate the CSV file. Default value: `No data to generate the file.` | "Your data object is empty!"

## Usage & Examples

### Render it inside your React application:

```javascript
import React from 'react';
import CsvGenerator from '@exlabs/react-csv-generator';

const data = [{ id: 1, name: 'first' }, { id: 2, name: 'second' }];

const MyComponent = () => {
  return (
    <div>
      <h1>Hello!</h1>
      <CsvGenerator fileName="my-name" items={data}>
        Download!
      </CsvGenerator>
    </div>
  );
};

export default MyComponent;
```

### Get data from the endpoint:
```javascript
import React from 'react';
import CsvGenerator from '@exlabs/react-csv-generator';

const MyComponent = () => {
  return (
    <div>
      <h1>Hello!</h1>
      <CsvGenerator
        fileName="my-name"
        baseEndpoint="https://api.punkapi.com/v2/beers"
      >
        Download!
      </CsvGenerator>
    </div>
  );
};

export default MyComponent;
```

### Get data from the endpoint with specific details:
```javascript
import React from 'react';
import CsvGenerator from '@exlabs/react-csv-generator';

const MyComponent = () => {
  return (
    <div>
      <h1>Hello!</h1>
      <CsvGenerator
        fileName="my-name"
        baseEndpoint="https://api.punkapi.com/v2/beers"
        endpointDetails={{ page: 3, per_page: 10 }}
      >
        Download!
      </CsvGenerator>
    </div>
  );
};

export default MyComponent;
```

### If your endpoint will return `total_pages` the component will try to fetch data from all pages and then generate the CSV. An example of the returned object might look like this:

```javascript
{
    items: [{...}],
    total_pages: 3,
}
```

The component will fetch `https://api...?page=1` then `https://api...?page=2` and finally `https://api...?page=3`. Only one CSV file will be generated with data from all pages. There is a big chance that your pagination endpoint works this way. Don't forget to pass `objectNameInResponse` prop. In the above example, it will be `items`.

### Generate file with custom labels:
```javascript
import React from 'react';
import CsvGenerator from '@exlabs/react-csv-generator';

const MyComponent = () => {
  return (
    <div>
      <h1>Hello!</h1>
      <CsvGenerator
        fileName="my-name"
        baseEndpoint="https://api.punkapi.com/v2/beers"
        endpointDetails={{ page: 3, per_page: 10 }}
        labels={{ boil_volume: 'Boil Volume', mash_temp: 'Mash Temperature' }}
      >
        Download!
      </CsvGenerator>
    </div>
  );
};

export default MyComponent;
```
## Demo
Coming soon

## Automation tests
For easier writing tests, we add `data-cy="csv-generator-btn"` attribute to the component's button. For example, if you are using Cypress.io you can easily get this item by `cy.get('[data-cy="csv-generator-btn"]')`

## Excel support
Opening generated CSV file in the newest Excel may be tricky. React CSV Generator uses commas as a separator so Excel needs to know about it.
1. Open Excel
2. Select new blank workbook
3. Click `File` and `Open`
4. Select a generated CSV file
5. In popup window select `Delimited` option and click `Next`
6. Set `comma` as a delimiter and click `Next`
7. Click `Finish` and enjoy 🎉


## License
MIT
