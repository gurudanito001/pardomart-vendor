# CreateVendorProductWithBarcodePayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vendorId** | **string** |  | [default to undefined]
**barcode** | **string** |  | [default to undefined]
**price** | **number** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**categoryIds** | **Array&lt;string&gt;** |  | [default to undefined]
**discountedPrice** | **number** |  | [optional] [default to undefined]
**sku** | **string** |  | [optional] [default to undefined]
**images** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**stock** | **number** |  | [optional] [default to undefined]
**isAvailable** | **boolean** |  | [optional] [default to true]
**attributes** | **{ [key: string]: any; }** |  | [optional] [default to undefined]
**tagIds** | **Array&lt;string&gt;** |  | [optional] [default to undefined]

## Example

```typescript
import { CreateVendorProductWithBarcodePayload } from './api';

const instance: CreateVendorProductWithBarcodePayload = {
    vendorId,
    barcode,
    price,
    name,
    description,
    categoryIds,
    discountedPrice,
    sku,
    images,
    stock,
    isAvailable,
    attributes,
    tagIds,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
