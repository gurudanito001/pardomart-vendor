# PaymentApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1PaymentsCreatePaymentIntentPost**](#apiv1paymentscreatepaymentintentpost) | **POST** /api/v1/payments/create-payment-intent | Create a Payment Intent for an order|
|[**apiV1PaymentsMeGet**](#apiv1paymentsmeget) | **GET** /api/v1/payments/me | Get my payment history|
|[**apiV1PaymentsMePaymentMethodsGet**](#apiv1paymentsmepaymentmethodsget) | **GET** /api/v1/payments/me/payment-methods | Get my saved payment methods|
|[**apiV1PaymentsMePaymentMethodsPaymentMethodIdDelete**](#apiv1paymentsmepaymentmethodspaymentmethodiddelete) | **DELETE** /api/v1/payments/me/payment-methods/{paymentMethodId} | Delete a saved payment method|
|[**apiV1PaymentsSetupIntentPost**](#apiv1paymentssetupintentpost) | **POST** /api/v1/payments/setup-intent | Create a Setup Intent to save a new payment method|

# **apiV1PaymentsCreatePaymentIntentPost**
> ApiV1PaymentsCreatePaymentIntentPost200Response apiV1PaymentsCreatePaymentIntentPost(apiV1PaymentsCreatePaymentIntentPostRequest)


### Example

```typescript
import {
    PaymentApi,
    Configuration,
    ApiV1PaymentsCreatePaymentIntentPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentApi(configuration);

let apiV1PaymentsCreatePaymentIntentPostRequest: ApiV1PaymentsCreatePaymentIntentPostRequest; //

const { status, data } = await apiInstance.apiV1PaymentsCreatePaymentIntentPost(
    apiV1PaymentsCreatePaymentIntentPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiV1PaymentsCreatePaymentIntentPostRequest** | **ApiV1PaymentsCreatePaymentIntentPostRequest**|  | |


### Return type

**ApiV1PaymentsCreatePaymentIntentPost200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Payment Intent created successfully. |  -  |
|**400** | Bad Request (e.g., order already paid). |  -  |
|**403** | Forbidden. |  -  |
|**404** | Order or User not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1PaymentsMeGet**
> Array<Payment> apiV1PaymentsMeGet()


### Example

```typescript
import {
    PaymentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentApi(configuration);

const { status, data } = await apiInstance.apiV1PaymentsMeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Payment>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of the user\&#39;s payments. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1PaymentsMePaymentMethodsGet**
> Array<SavedPaymentMethod> apiV1PaymentsMePaymentMethodsGet()


### Example

```typescript
import {
    PaymentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentApi(configuration);

const { status, data } = await apiInstance.apiV1PaymentsMePaymentMethodsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SavedPaymentMethod>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of the user\&#39;s saved payment methods. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1PaymentsMePaymentMethodsPaymentMethodIdDelete**
> apiV1PaymentsMePaymentMethodsPaymentMethodIdDelete()


### Example

```typescript
import {
    PaymentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentApi(configuration);

let paymentMethodId: string; //The Stripe PaymentMethod ID (pm_...). (default to undefined)

const { status, data } = await apiInstance.apiV1PaymentsMePaymentMethodsPaymentMethodIdDelete(
    paymentMethodId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **paymentMethodId** | [**string**] | The Stripe PaymentMethod ID (pm_...). | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Payment method detached successfully. |  -  |
|**403** | Forbidden. |  -  |
|**404** | Payment method not found for this user. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1PaymentsSetupIntentPost**
> ApiV1PaymentsCreatePaymentIntentPost200Response apiV1PaymentsSetupIntentPost()

Creates a Setup Intent to be used on the client-side for saving a new card for future use.

### Example

```typescript
import {
    PaymentApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentApi(configuration);

const { status, data } = await apiInstance.apiV1PaymentsSetupIntentPost();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiV1PaymentsCreatePaymentIntentPost200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Setup Intent created successfully. |  -  |
|**401** | Unauthorized. |  -  |
|**404** | User not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

