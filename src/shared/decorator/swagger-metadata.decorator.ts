import { SetMetadata, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiBodyOptions,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiQueryOptions,
  ApiResponse,
  ApiResponseOptions,
  ApiTags,
} from '@nestjs/swagger';

type Params = ApiQueryOptions;

type Options = {
  apiDocumentations: string;
  tags: string[];
  operationSummary: string;
  queryParameters?: Params[];
  isUpload?: boolean;
  body?: ApiBodyOptions;
  response?: ApiResponseOptions;
};

export function CreateSwaggerMetadata(options: Options) {
  const {
    tags,
    operationSummary,
    queryParameters,
    apiDocumentations,
    isUpload,
    body,
    response,
  } = options;

  const decorators = [
    ApiTags(...tags),
    ApiBearerAuth(),
    ApiOperation({ summary: operationSummary }),
  ];

  if (queryParameters) {
    queryParameters.forEach((param) => {
      decorators.push(ApiQuery(param));
    });
  }

  if (isUpload) {
    decorators.push(ApiConsumes('multipart/form-data'));
  }

  if (body) {
    decorators.push(ApiBody(body));
  }

  if (response) {
    decorators.push(ApiResponse(response));
  }

  return SetMetadata(apiDocumentations, {
    decorators: applyDecorators(...decorators),
  });
}
