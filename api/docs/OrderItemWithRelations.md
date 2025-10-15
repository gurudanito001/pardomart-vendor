# OrderItemWithRelations


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**orderId** | **string** |  | [optional] [default to undefined]
**vendorProductId** | **string** |  | [optional] [default to undefined]
**quantity** | **number** |  | [optional] [default to undefined]
**instructions** | **string** |  | [optional] [default to undefined]
**status** | [**OrderItemStatus**](OrderItemStatus.md) |  | [optional] [default to undefined]
**quantityFound** | **number** |  | [optional] [default to undefined]
**chosenReplacementId** | **string** |  | [optional] [default to undefined]
**isReplacementApproved** | **boolean** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**vendorProduct** | [**VendorProductWithProduct**](VendorProductWithProduct.md) |  | [optional] [default to undefined]
**chosenReplacement** | [**VendorProductWithProduct**](VendorProductWithProduct.md) |  | [optional] [default to undefined]
**replacements** | [**Array&lt;VendorProductWithProduct&gt;**](VendorProductWithProduct.md) |  | [optional] [default to undefined]

## Example

```typescript
import { OrderItemWithRelations } from './api';

const instance: OrderItemWithRelations = {
    id,
    orderId,
    vendorProductId,
    quantity,
    instructions,
    status,
    quantityFound,
    chosenReplacementId,
    isReplacementApproved,
    createdAt,
    updatedAt,
    vendorProduct,
    chosenReplacement,
    replacements,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
