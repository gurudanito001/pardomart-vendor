# VendorOpeningHoursApi

All URIs are relative to *http://localhost:5000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**openingHoursGet**](#openinghoursget) | **GET** /openingHours | Get all opening hours for a specific vendor|
|[**openingHoursPatch**](#openinghourspatch) | **PATCH** /openingHours | Update opening hours for a specific day|

# **openingHoursGet**
> Array<VendorOpeningHours> openingHoursGet()


### Example

```typescript
import {
    VendorOpeningHoursApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorOpeningHoursApi(configuration);

let vendorId: string; //The ID of the vendor to retrieve opening hours for. (default to undefined)

const { status, data } = await apiInstance.openingHoursGet(
    vendorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **vendorId** | [**string**] | The ID of the vendor to retrieve opening hours for. | defaults to undefined|


### Return type

**Array<VendorOpeningHours>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of the vendor\&#39;s opening hours. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **openingHoursPatch**
> VendorOpeningHours openingHoursPatch(updateOpeningHoursPayload)

Finds and updates the opening and closing times for a given vendor on a specific day of the week.

### Example

```typescript
import {
    VendorOpeningHoursApi,
    Configuration,
    UpdateOpeningHoursPayload
} from './api';

const configuration = new Configuration();
const apiInstance = new VendorOpeningHoursApi(configuration);

let updateOpeningHoursPayload: UpdateOpeningHoursPayload; //

const { status, data } = await apiInstance.openingHoursPatch(
    updateOpeningHoursPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateOpeningHoursPayload** | **UpdateOpeningHoursPayload**|  | |


### Return type

**VendorOpeningHours**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | The updated opening hours record. |  -  |
|**400** | Bad request, vendorId and day are required. |  -  |
|**404** | Opening hours record not found for the specified vendor and day. |  -  |
|**409** | Conflict - this should not typically occur on an update. |  -  |
|**500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

