# StoreWithLimitedProducts


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**store** | [**Vendor**](Vendor.md) |  | [optional] [default to undefined]
**products** | [**Array&lt;VendorProduct&gt;**](VendorProduct.md) |  | [optional] [default to undefined]
**totalProducts** | **number** | The total number of products found in the store that match the search criteria. | [optional] [default to undefined]

## Example

```typescript
import { StoreWithLimitedProducts } from './api';

const instance: StoreWithLimitedProducts = {
    store,
    products,
    totalProducts,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
