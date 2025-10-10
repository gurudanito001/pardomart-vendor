# UpdateOrderPayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalAmount** | **number** |  | [optional] [default to undefined]
**deliveryFee** | **number** |  | [optional] [default to undefined]
**serviceFee** | **number** |  | [optional] [default to undefined]
**shoppingFee** | **number** |  | [optional] [default to undefined]
**paymentMethod** | [**PaymentMethods**](PaymentMethods.md) |  | [optional] [default to undefined]
**paymentStatus** | **string** |  | [optional] [default to undefined]
**orderStatus** | [**OrderStatus**](OrderStatus.md) |  | [optional] [default to undefined]
**deliveryAddressId** | **string** |  | [optional] [default to undefined]
**deliveryInstructions** | **string** |  | [optional] [default to undefined]
**shoppingHandlerId** | **string** |  | [optional] [default to undefined]
**deliveryPersonId** | **string** |  | [optional] [default to undefined]
**shoppingMethod** | [**ShoppingMethod**](ShoppingMethod.md) |  | [optional] [default to undefined]
**deliveryMethod** | [**DeliveryMethod**](DeliveryMethod.md) |  | [optional] [default to undefined]
**scheduledShoppingStartTime** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { UpdateOrderPayload } from './api';

const instance: UpdateOrderPayload = {
    totalAmount,
    deliveryFee,
    serviceFee,
    shoppingFee,
    paymentMethod,
    paymentStatus,
    orderStatus,
    deliveryAddressId,
    deliveryInstructions,
    shoppingHandlerId,
    deliveryPersonId,
    shoppingMethod,
    deliveryMethod,
    scheduledShoppingStartTime,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
