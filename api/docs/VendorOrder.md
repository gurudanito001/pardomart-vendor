# VendorOrder


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**userId** | **string** |  | [optional] [default to undefined]
**vendorId** | **string** |  | [optional] [default to undefined]
**totalAmount** | **number** |  | [optional] [default to undefined]
**deliveryFee** | **number** |  | [optional] [default to undefined]
**serviceFee** | **number** |  | [optional] [default to undefined]
**shoppingFee** | **number** |  | [optional] [default to undefined]
**paymentMethod** | [**PaymentMethods**](PaymentMethods.md) |  | [optional] [default to undefined]
**paymentStatus** | **string** |  | [optional] [default to undefined]
**orderStatus** | [**OrderStatus**](OrderStatus.md) |  | [optional] [default to undefined]
**deliveryAddressId** | **string** |  | [optional] [default to undefined]
**deliveryInstructions** | **string** |  | [optional] [default to undefined]
**shoppingMethod** | [**ShoppingMethod**](ShoppingMethod.md) |  | [optional] [default to undefined]
**deliveryMethod** | [**DeliveryMethod**](DeliveryMethod.md) |  | [optional] [default to undefined]
**scheduledShoppingStartTime** | **string** |  | [optional] [default to undefined]
**shoppingHandlerId** | **string** |  | [optional] [default to undefined]
**deliveryPersonId** | **string** |  | [optional] [default to undefined]
**reasonForDecline** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**orderItems** | [**Array&lt;OrderItemWithRelations&gt;**](OrderItemWithRelations.md) |  | [optional] [default to undefined]
**user** | [**UserSummary**](UserSummary.md) |  | [optional] [default to undefined]
**vendor** | [**VendorWithDetails**](VendorWithDetails.md) |  | [optional] [default to undefined]
**deliveryAddress** | [**DeliveryAddress**](DeliveryAddress.md) |  | [optional] [default to undefined]
**shopper** | [**UserSummary**](UserSummary.md) |  | [optional] [default to undefined]
**deliverer** | [**User**](User.md) |  | [optional] [default to undefined]
**orderCode** | **string** | A unique, human-readable code for the order. | [optional] [default to undefined]
**deliveryPerson** | [**UserSummary**](UserSummary.md) |  | [optional] [default to undefined]

## Example

```typescript
import { VendorOrder } from './api';

const instance: VendorOrder = {
    id,
    userId,
    vendorId,
    totalAmount,
    deliveryFee,
    serviceFee,
    shoppingFee,
    paymentMethod,
    paymentStatus,
    orderStatus,
    deliveryAddressId,
    deliveryInstructions,
    shoppingMethod,
    deliveryMethod,
    scheduledShoppingStartTime,
    shoppingHandlerId,
    deliveryPersonId,
    reasonForDecline,
    createdAt,
    updatedAt,
    orderItems,
    user,
    vendor,
    deliveryAddress,
    shopper,
    deliverer,
    orderCode,
    deliveryPerson,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
