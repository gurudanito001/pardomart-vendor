# Country


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | The common name of the country. | [optional] [default to undefined]
**iso2** | **string** | The ISO 3166-1 alpha-2 country code. | [optional] [default to undefined]
**dialCode** | **string** | The country\&#39;s international calling code (e.g., +234). | [optional] [default to undefined]
**flagPng** | **string** | URL to the country\&#39;s flag in PNG format. | [optional] [default to undefined]
**flagSvg** | **string** | URL to the country\&#39;s flag in SVG format. | [optional] [default to undefined]

## Example

```typescript
import { Country } from './api';

const instance: Country = {
    name,
    iso2,
    dialCode,
    flagPng,
    flagSvg,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
