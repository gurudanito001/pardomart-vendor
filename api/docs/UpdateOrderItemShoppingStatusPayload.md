# UpdateOrderItemShoppingStatusPayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | [**OrderItemStatus**](OrderItemStatus.md) |  | [default to undefined]
**quantityFound** | **number** | Required if status is FOUND. | [optional] [default to undefined]
**chosenReplacementId** | **string** | The vendorProductId of the suggested replacement if status is NOT_FOUND. | [optional] [default to undefined]

## Example

```typescript
import { UpdateOrderItemShoppingStatusPayload } from './api';

const instance: UpdateOrderItemShoppingStatusPayload = {
    status,
    quantityFound,
    chosenReplacementId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
