# StoreWithProducts


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vendor** | [**VendorWithExtras**](VendorWithExtras.md) |  | [optional] [default to undefined]
**products** | [**Array&lt;VendorProduct&gt;**](VendorProduct.md) | A sample of products from the store that match the search criteria (if applicable). | [optional] [default to undefined]
**totalProducts** | **number** | The total number of products in the store that match the search criteria (if applicable). | [optional] [default to undefined]

## Example

```typescript
import { StoreWithProducts } from './api';

const instance: StoreWithProducts = {
    vendor,
    products,
    totalProducts,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
