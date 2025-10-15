# ProductVendorTransferPost200ResponseDetailsInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sourceVendorProductId** | **string** |  | [optional] [default to undefined]
**transferredTo** | **Array&lt;string&gt;** | List of store IDs the product was successfully transferred to. | [optional] [default to undefined]
**skippedFor** | **Array&lt;string&gt;** | List of store IDs where the product already existed. | [optional] [default to undefined]

## Example

```typescript
import { ProductVendorTransferPost200ResponseDetailsInner } from './api';

const instance: ProductVendorTransferPost200ResponseDetailsInner = {
    sourceVendorProductId,
    transferredTo,
    skippedFor,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
