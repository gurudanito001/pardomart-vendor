# NotificationApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**devicesFcmTokenDelete**](#devicesfcmtokendelete) | **DELETE** /devices/{fcmToken} | Unregister a device for push notifications|
|[**devicesPost**](#devicespost) | **POST** /devices | Register a device for push notifications|
|[**notificationsGet**](#notificationsget) | **GET** /notifications | Get notifications for the authenticated user|
|[**notificationsNotificationIdReadPatch**](#notificationsnotificationidreadpatch) | **PATCH** /notifications/{notificationId}/read | Mark a specific notification as read|
|[**notificationsReadAllPatch**](#notificationsreadallpatch) | **PATCH** /notifications/read-all | Mark all unread notifications as read|
|[**notificationsUnreadCountGet**](#notificationsunreadcountget) | **GET** /notifications/unread-count | Get the count of unread notifications|

# **devicesFcmTokenDelete**
> devicesFcmTokenDelete()


### Example

```typescript
import {
    NotificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationApi(configuration);

let fcmToken: string; //The FCM token of the device to unregister. (default to undefined)

const { status, data } = await apiInstance.devicesFcmTokenDelete(
    fcmToken
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fcmToken** | [**string**] | The FCM token of the device to unregister. | defaults to undefined|


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
|**204** | Device unregistered successfully. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **devicesPost**
> Device devicesPost(devicesPostRequest)


### Example

```typescript
import {
    NotificationApi,
    Configuration,
    DevicesPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationApi(configuration);

let devicesPostRequest: DevicesPostRequest; //

const { status, data } = await apiInstance.devicesPost(
    devicesPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **devicesPostRequest** | **DevicesPostRequest**|  | |


### Return type

**Device**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Device registered successfully. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **notificationsGet**
> PaginatedNotifications notificationsGet()


### Example

```typescript
import {
    NotificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationApi(configuration);

let page: number; //Page number for pagination. (optional) (default to 1)
let size: number; //Number of items per page. (optional) (default to 20)

const { status, data } = await apiInstance.notificationsGet(
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number for pagination. | (optional) defaults to 1|
| **size** | [**number**] | Number of items per page. | (optional) defaults to 20|


### Return type

**PaginatedNotifications**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A paginated list of notifications. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **notificationsNotificationIdReadPatch**
> Notification notificationsNotificationIdReadPatch()


### Example

```typescript
import {
    NotificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationApi(configuration);

let notificationId: string; //The ID of the notification to mark as read. (default to undefined)

const { status, data } = await apiInstance.notificationsNotificationIdReadPatch(
    notificationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **notificationId** | [**string**] | The ID of the notification to mark as read. | defaults to undefined|


### Return type

**Notification**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated notification. |  -  |
|**404** | Notification not found or user does not have permission. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **notificationsReadAllPatch**
> NotificationsReadAllPatch200Response notificationsReadAllPatch()


### Example

```typescript
import {
    NotificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationApi(configuration);

const { status, data } = await apiInstance.notificationsReadAllPatch();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**NotificationsReadAllPatch200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The number of notifications that were updated. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **notificationsUnreadCountGet**
> NotificationsReadAllPatch200Response notificationsUnreadCountGet()


### Example

```typescript
import {
    NotificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationApi(configuration);

const { status, data } = await apiInstance.notificationsUnreadCountGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**NotificationsReadAllPatch200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The count of unread notifications. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

