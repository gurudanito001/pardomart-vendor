# AuthApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authInitiateLoginPost**](#authinitiateloginpost) | **POST** /auth/initiate-login | Initiate user login or resend verification code|
|[**authRegisterPost**](#authregisterpost) | **POST** /auth/register | Register a new user|
|[**authVerifyLoginPost**](#authverifyloginpost) | **POST** /auth/verify-login | Verify code and log in|

# **authInitiateLoginPost**
> AuthInitiateLoginPost200Response authInitiateLoginPost(authInitiateLoginPostRequest)

Checks if a user exists with the given mobile number and role. If they exist, a verification code is sent to their mobile number.

### Example

```typescript
import {
    AuthApi,
    Configuration,
    AuthInitiateLoginPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let authInitiateLoginPostRequest: AuthInitiateLoginPostRequest; //

const { status, data } = await apiInstance.authInitiateLoginPost(
    authInitiateLoginPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authInitiateLoginPostRequest** | **AuthInitiateLoginPostRequest**|  | |


### Return type

**AuthInitiateLoginPost200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Verification code sent successfully. The actual role of the user is returned. |  -  |
|**404** | User not found. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authRegisterPost**
> authRegisterPost(authRegisterPostRequest)

Creates a new user account and sends a verification code to their mobile number.

### Example

```typescript
import {
    AuthApi,
    Configuration,
    AuthRegisterPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let authRegisterPostRequest: AuthRegisterPostRequest; //

const { status, data } = await apiInstance.authRegisterPost(
    authRegisterPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authRegisterPostRequest** | **AuthRegisterPostRequest**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Verification code sent successfully. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authVerifyLoginPost**
> authVerifyLoginPost(authVerifyLoginPostRequest)

Verifies the provided code for the given mobile number and role, and returns a JWT token upon successful verification.

### Example

```typescript
import {
    AuthApi,
    Configuration,
    AuthVerifyLoginPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let authVerifyLoginPostRequest: AuthVerifyLoginPostRequest; //

const { status, data } = await apiInstance.authVerifyLoginPost(
    authVerifyLoginPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authVerifyLoginPostRequest** | **AuthVerifyLoginPostRequest**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Login successful, returns user object with token. |  -  |
|**401** | Invalid verification code or code has expired. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

