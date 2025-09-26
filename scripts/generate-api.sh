#!/bin/bash

# PardoMart API Client Generation Script (Unix/Linux/macOS)
# This script generates a TypeScript Axios client from the OpenAPI specification

echo "🚀 Generating PardoMart API Client..."

API_SPEC_URL="https://pardomart-node-api-vaje.onrender.com/api-docs/openapi.json"
OUTPUT_DIR="./api"

# Clean only generated files, preserve custom configuration
echo "Cleaning generated API files (preserving config.ts)..."

GENERATED_FILES=(
    "$OUTPUT_DIR/api.ts"
    "$OUTPUT_DIR/base.ts" 
    "$OUTPUT_DIR/common.ts"
    "$OUTPUT_DIR/configuration.ts"
    "$OUTPUT_DIR/index.ts"
    "$OUTPUT_DIR/endpoints"
    "$OUTPUT_DIR/models"
    "$OUTPUT_DIR/docs"
    "$OUTPUT_DIR/git_push.sh"
    "$OUTPUT_DIR/.gitignore"
    "$OUTPUT_DIR/.npmignore"
    "$OUTPUT_DIR/.openapi-generator-ignore"
    "$OUTPUT_DIR/.openapi-generator"
)

for file in "${GENERATED_FILES[@]}"; do
    if [ -e "$file" ]; then
        echo "  🗑️  Removing: $file"
        rm -rf "$file"
    fi
done

# Generate the API client
echo "📥 Downloading OpenAPI spec from: $API_SPEC_URL"
echo "📤 Generating TypeScript Axios client to: $OUTPUT_DIR"

npx @openapitools/openapi-generator-cli generate \
  -i "$API_SPEC_URL" \
  -g typescript-axios \
  -o "$OUTPUT_DIR" \
  --skip-validate-spec \
  --additional-properties=supportsES6=true,withSeparateModelsAndApi=true,prependFormOrBodyParameters=true,legacyDiscriminatorBehavior=false,apiPackage=endpoints,modelPackage=models

if [ $? -eq 0 ]; then
    echo "✅ API client generated successfully!"
    echo "📋 Generated files are located in: $OUTPUT_DIR"
    echo ""
    echo "Custom configuration preserved:"
    echo "   - config.ts (API configuration & token management)"
    echo ""
    echo "You can import APIs from 'api/endpoints' (e.g., AuthApi, ProductApi)"
    echo "You can import types from 'api/models' (e.g., User, Product)"
else
    echo "❌ API client generation failed!"
    exit 1
fi
