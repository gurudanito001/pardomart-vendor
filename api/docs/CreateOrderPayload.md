# CreateOrderPayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vendorId** | **string** |  | [default to undefined]
**paymentMethod** | [**PaymentMethods**](PaymentMethods.md) |  | [default to undefined]
**shippingAddressId** | **string** | ID of an existing delivery address. Required if newShippingAddress is not provided for a delivery order. | [optional] [default to undefined]
**newShippingAddress** | [**CreateDeliveryAddressPayload**](CreateDeliveryAddressPayload.md) |  | [optional] [default to undefined]
**deliveryInstructions** | **string** |  | [optional] [default to undefined]
**orderItems** | [**Array&lt;OrderItemPayload&gt;**](OrderItemPayload.md) |  | [default to undefined]
**shoppingMethod** | [**ShoppingMethod**](ShoppingMethod.md) |  | [default to undefined]
**deliveryMethod** | [**DeliveryMethod**](DeliveryMethod.md) |  | [default to undefined]
**scheduledShoppingStartTime** | **string** | Optional. The UTC time when shopping should begin. Must be within vendor\&#39;s operating hours. | [optional] [default to undefined]

## Example

```typescript
import { CreateOrderPayload } from './api';

const instance: CreateOrderPayload = {
    vendorId,
    paymentMethod,
    shippingAddressId,
    newShippingAddress,
    deliveryInstructions,
    orderItems,
    shoppingMethod,
    deliveryMethod,
    scheduledShoppingStartTime,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
