# Payment


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**amount** | **number** |  | [optional] [default to undefined]
**currency** | **string** |  | [optional] [default to undefined]
**status** | [**PaymentStatus**](PaymentStatus.md) |  | [optional] [default to undefined]
**userId** | **string** |  | [optional] [default to undefined]
**orderId** | **string** |  | [optional] [default to undefined]
**stripePaymentIntentId** | **string** |  | [optional] [default to undefined]
**paymentMethodDetails** | **object** | Details about the payment method used, from Stripe. | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { Payment } from './api';

const instance: Payment = {
    id,
    amount,
    currency,
    status,
    userId,
    orderId,
    stripePaymentIntentId,
    paymentMethodDetails,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
