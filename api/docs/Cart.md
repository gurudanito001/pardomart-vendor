# Cart


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**userId** | **string** |  | [optional] [default to undefined]
**vendorId** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**cartItems** | [**Array&lt;CartItem&gt;**](CartItem.md) |  | [optional] [default to undefined]
**vendor** | [**Vendor**](Vendor.md) |  | [optional] [default to undefined]
**items** | [**Array&lt;CartItemWithProduct&gt;**](CartItemWithProduct.md) |  | [optional] [default to undefined]

## Example

```typescript
import { Cart } from './api';

const instance: Cart = {
    id,
    userId,
    vendorId,
    createdAt,
    updatedAt,
    cartItems,
    vendor,
    items,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
