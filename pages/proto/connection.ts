/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  ChannelOptions,
  Client,
  ClientUnaryCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Empty } from "../../google/protobuf/empty";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "db_connection";

/** Arguments for Login */
export interface LoginRequest {
  username: string;
  password: string;
  create: boolean;
}

/** Arguments used for queries and any updates. */
export interface QueryRequest {
  id: string;
  query: string;
}

/** Result from connecting for the first-time */
export interface ConnectResult {
  id: string;
}

/** Result from executing an SQL Query */
export interface QueryResult {
  columnNames: string[];
  rowValues: RowValue[];
}

/** Result from executing an SQL Update Command */
export interface UpdateResult {
  message: string;
}

/** Result from executing a Version Control Command */
export interface VersionControlResult {
  message: string;
}

/** Value of one row */
export interface RowValue {
  cellValues: CellValue[];
}

/** Value of one 'cell' */
export interface CellValue {
  colString: string | undefined;
  colI32: number | undefined;
  colTime: Date | undefined;
  colFloat: number | undefined;
  colDouble: number | undefined;
  colI64: number | undefined;
  colBool: boolean | undefined;
  colNull: Empty | undefined;
}

function createBaseLoginRequest(): LoginRequest {
  return { username: "", password: "", create: false };
}

export const LoginRequest = {
  encode(message: LoginRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.username !== "") {
      writer.uint32(106).string(message.username);
    }
    if (message.password !== "") {
      writer.uint32(114).string(message.password);
    }
    if (message.create === true) {
      writer.uint32(120).bool(message.create);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoginRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 13:
          message.username = reader.string();
          break;
        case 14:
          message.password = reader.string();
          break;
        case 15:
          message.create = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LoginRequest {
    return {
      username: isSet(object.username) ? String(object.username) : "",
      password: isSet(object.password) ? String(object.password) : "",
      create: isSet(object.create) ? Boolean(object.create) : false,
    };
  },

  toJSON(message: LoginRequest): unknown {
    const obj: any = {};
    message.username !== undefined && (obj.username = message.username);
    message.password !== undefined && (obj.password = message.password);
    message.create !== undefined && (obj.create = message.create);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LoginRequest>, I>>(object: I): LoginRequest {
    const message = createBaseLoginRequest();
    message.username = object.username ?? "";
    message.password = object.password ?? "";
    message.create = object.create ?? false;
    return message;
  },
};

function createBaseQueryRequest(): QueryRequest {
  return { id: "", query: "" };
}

export const QueryRequest = {
  encode(message: QueryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(82).string(message.id);
    }
    if (message.query !== "") {
      writer.uint32(90).string(message.query);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 10:
          message.id = reader.string();
          break;
        case 11:
          message.query = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryRequest {
    return { id: isSet(object.id) ? String(object.id) : "", query: isSet(object.query) ? String(object.query) : "" };
  },

  toJSON(message: QueryRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.query !== undefined && (obj.query = message.query);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryRequest>, I>>(object: I): QueryRequest {
    const message = createBaseQueryRequest();
    message.id = object.id ?? "";
    message.query = object.query ?? "";
    return message;
  },
};

function createBaseConnectResult(): ConnectResult {
  return { id: "" };
}

export const ConnectResult = {
  encode(message: ConnectResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(98).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ConnectResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConnectResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 12:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConnectResult {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: ConnectResult): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ConnectResult>, I>>(object: I): ConnectResult {
    const message = createBaseConnectResult();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseQueryResult(): QueryResult {
  return { columnNames: [], rowValues: [] };
}

export const QueryResult = {
  encode(message: QueryResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.columnNames) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.rowValues) {
      RowValue.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3:
          message.columnNames.push(reader.string());
          break;
        case 4:
          message.rowValues.push(RowValue.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryResult {
    return {
      columnNames: Array.isArray(object?.columnNames) ? object.columnNames.map((e: any) => String(e)) : [],
      rowValues: Array.isArray(object?.rowValues) ? object.rowValues.map((e: any) => RowValue.fromJSON(e)) : [],
    };
  },

  toJSON(message: QueryResult): unknown {
    const obj: any = {};
    if (message.columnNames) {
      obj.columnNames = message.columnNames.map((e) => e);
    } else {
      obj.columnNames = [];
    }
    if (message.rowValues) {
      obj.rowValues = message.rowValues.map((e) => e ? RowValue.toJSON(e) : undefined);
    } else {
      obj.rowValues = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryResult>, I>>(object: I): QueryResult {
    const message = createBaseQueryResult();
    message.columnNames = object.columnNames?.map((e) => e) || [];
    message.rowValues = object.rowValues?.map((e) => RowValue.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUpdateResult(): UpdateResult {
  return { message: "" };
}

export const UpdateResult = {
  encode(message: UpdateResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.message !== "") {
      writer.uint32(10).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateResult {
    return { message: isSet(object.message) ? String(object.message) : "" };
  },

  toJSON(message: UpdateResult): unknown {
    const obj: any = {};
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateResult>, I>>(object: I): UpdateResult {
    const message = createBaseUpdateResult();
    message.message = object.message ?? "";
    return message;
  },
};

function createBaseVersionControlResult(): VersionControlResult {
  return { message: "" };
}

export const VersionControlResult = {
  encode(message: VersionControlResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VersionControlResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVersionControlResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): VersionControlResult {
    return { message: isSet(object.message) ? String(object.message) : "" };
  },

  toJSON(message: VersionControlResult): unknown {
    const obj: any = {};
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<VersionControlResult>, I>>(object: I): VersionControlResult {
    const message = createBaseVersionControlResult();
    message.message = object.message ?? "";
    return message;
  },
};

function createBaseRowValue(): RowValue {
  return { cellValues: [] };
}

export const RowValue = {
  encode(message: RowValue, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.cellValues) {
      CellValue.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RowValue {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRowValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 5:
          message.cellValues.push(CellValue.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RowValue {
    return {
      cellValues: Array.isArray(object?.cellValues) ? object.cellValues.map((e: any) => CellValue.fromJSON(e)) : [],
    };
  },

  toJSON(message: RowValue): unknown {
    const obj: any = {};
    if (message.cellValues) {
      obj.cellValues = message.cellValues.map((e) => e ? CellValue.toJSON(e) : undefined);
    } else {
      obj.cellValues = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RowValue>, I>>(object: I): RowValue {
    const message = createBaseRowValue();
    message.cellValues = object.cellValues?.map((e) => CellValue.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCellValue(): CellValue {
  return {
    colString: undefined,
    colI32: undefined,
    colTime: undefined,
    colFloat: undefined,
    colDouble: undefined,
    colI64: undefined,
    colBool: undefined,
    colNull: undefined,
  };
}

export const CellValue = {
  encode(message: CellValue, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.colString !== undefined) {
      writer.uint32(50).string(message.colString);
    }
    if (message.colI32 !== undefined) {
      writer.uint32(56).int32(message.colI32);
    }
    if (message.colTime !== undefined) {
      Timestamp.encode(toTimestamp(message.colTime), writer.uint32(66).fork()).ldelim();
    }
    if (message.colFloat !== undefined) {
      writer.uint32(77).float(message.colFloat);
    }
    if (message.colDouble !== undefined) {
      writer.uint32(129).double(message.colDouble);
    }
    if (message.colI64 !== undefined) {
      writer.uint32(136).int64(message.colI64);
    }
    if (message.colBool !== undefined) {
      writer.uint32(144).bool(message.colBool);
    }
    if (message.colNull !== undefined) {
      Empty.encode(message.colNull, writer.uint32(154).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CellValue {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCellValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 6:
          message.colString = reader.string();
          break;
        case 7:
          message.colI32 = reader.int32();
          break;
        case 8:
          message.colTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 9:
          message.colFloat = reader.float();
          break;
        case 16:
          message.colDouble = reader.double();
          break;
        case 17:
          message.colI64 = longToNumber(reader.int64() as Long);
          break;
        case 18:
          message.colBool = reader.bool();
          break;
        case 19:
          message.colNull = Empty.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CellValue {
    return {
      colString: isSet(object.colString) ? String(object.colString) : undefined,
      colI32: isSet(object.colI32) ? Number(object.colI32) : undefined,
      colTime: isSet(object.colTime) ? fromJsonTimestamp(object.colTime) : undefined,
      colFloat: isSet(object.colFloat) ? Number(object.colFloat) : undefined,
      colDouble: isSet(object.colDouble) ? Number(object.colDouble) : undefined,
      colI64: isSet(object.colI64) ? Number(object.colI64) : undefined,
      colBool: isSet(object.colBool) ? Boolean(object.colBool) : undefined,
      colNull: isSet(object.colNull) ? Empty.fromJSON(object.colNull) : undefined,
    };
  },

  toJSON(message: CellValue): unknown {
    const obj: any = {};
    message.colString !== undefined && (obj.colString = message.colString);
    message.colI32 !== undefined && (obj.colI32 = Math.round(message.colI32));
    message.colTime !== undefined && (obj.colTime = message.colTime.toISOString());
    message.colFloat !== undefined && (obj.colFloat = message.colFloat);
    message.colDouble !== undefined && (obj.colDouble = message.colDouble);
    message.colI64 !== undefined && (obj.colI64 = Math.round(message.colI64));
    message.colBool !== undefined && (obj.colBool = message.colBool);
    message.colNull !== undefined && (obj.colNull = message.colNull ? Empty.toJSON(message.colNull) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CellValue>, I>>(object: I): CellValue {
    const message = createBaseCellValue();
    message.colString = object.colString ?? undefined;
    message.colI32 = object.colI32 ?? undefined;
    message.colTime = object.colTime ?? undefined;
    message.colFloat = object.colFloat ?? undefined;
    message.colDouble = object.colDouble ?? undefined;
    message.colI64 = object.colI64 ?? undefined;
    message.colBool = object.colBool ?? undefined;
    message.colNull = (object.colNull !== undefined && object.colNull !== null)
      ? Empty.fromPartial(object.colNull)
      : undefined;
    return message;
  },
};

/** Services are the "functions" exposed by the server. */
export type DatabaseConnectionService = typeof DatabaseConnectionService;
export const DatabaseConnectionService = {
  /** We can optionally have a VC query function here, or just parse that within Update */
  connectDB: {
    path: "/db_connection.DatabaseConnection/ConnectDB",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: LoginRequest) => Buffer.from(LoginRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => LoginRequest.decode(value),
    responseSerialize: (value: ConnectResult) => Buffer.from(ConnectResult.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ConnectResult.decode(value),
  },
  disconnectDB: {
    path: "/db_connection.DatabaseConnection/DisconnectDB",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ConnectResult) => Buffer.from(ConnectResult.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ConnectResult.decode(value),
    responseSerialize: (value: Empty) => Buffer.from(Empty.encode(value).finish()),
    responseDeserialize: (value: Buffer) => Empty.decode(value),
  },
  runQuery: {
    path: "/db_connection.DatabaseConnection/RunQuery",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: QueryRequest) => Buffer.from(QueryRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => QueryRequest.decode(value),
    responseSerialize: (value: QueryResult) => Buffer.from(QueryResult.encode(value).finish()),
    responseDeserialize: (value: Buffer) => QueryResult.decode(value),
  },
  runUpdate: {
    path: "/db_connection.DatabaseConnection/RunUpdate",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: QueryRequest) => Buffer.from(QueryRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => QueryRequest.decode(value),
    responseSerialize: (value: UpdateResult) => Buffer.from(UpdateResult.encode(value).finish()),
    responseDeserialize: (value: Buffer) => UpdateResult.decode(value),
  },
  runVersionControlCommand: {
    path: "/db_connection.DatabaseConnection/RunVersionControlCommand",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: QueryRequest) => Buffer.from(QueryRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => QueryRequest.decode(value),
    responseSerialize: (value: VersionControlResult) => Buffer.from(VersionControlResult.encode(value).finish()),
    responseDeserialize: (value: Buffer) => VersionControlResult.decode(value),
  },
} as const;

export interface DatabaseConnectionServer extends UntypedServiceImplementation {
  /** We can optionally have a VC query function here, or just parse that within Update */
  connectDB: handleUnaryCall<LoginRequest, ConnectResult>;
  disconnectDB: handleUnaryCall<ConnectResult, Empty>;
  runQuery: handleUnaryCall<QueryRequest, QueryResult>;
  runUpdate: handleUnaryCall<QueryRequest, UpdateResult>;
  runVersionControlCommand: handleUnaryCall<QueryRequest, VersionControlResult>;
}

export interface DatabaseConnectionClient extends Client {
  /** We can optionally have a VC query function here, or just parse that within Update */
  connectDB(
    request: LoginRequest,
    callback: (error: ServiceError | null, response: ConnectResult) => void,
  ): ClientUnaryCall;
  connectDB(
    request: LoginRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: ConnectResult) => void,
  ): ClientUnaryCall;
  connectDB(
    request: LoginRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: ConnectResult) => void,
  ): ClientUnaryCall;
  disconnectDB(
    request: ConnectResult,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  disconnectDB(
    request: ConnectResult,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  disconnectDB(
    request: ConnectResult,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  runQuery(
    request: QueryRequest,
    callback: (error: ServiceError | null, response: QueryResult) => void,
  ): ClientUnaryCall;
  runQuery(
    request: QueryRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: QueryResult) => void,
  ): ClientUnaryCall;
  runQuery(
    request: QueryRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: QueryResult) => void,
  ): ClientUnaryCall;
  runUpdate(
    request: QueryRequest,
    callback: (error: ServiceError | null, response: UpdateResult) => void,
  ): ClientUnaryCall;
  runUpdate(
    request: QueryRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: UpdateResult) => void,
  ): ClientUnaryCall;
  runUpdate(
    request: QueryRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: UpdateResult) => void,
  ): ClientUnaryCall;
  runVersionControlCommand(
    request: QueryRequest,
    callback: (error: ServiceError | null, response: VersionControlResult) => void,
  ): ClientUnaryCall;
  runVersionControlCommand(
    request: QueryRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: VersionControlResult) => void,
  ): ClientUnaryCall;
  runVersionControlCommand(
    request: QueryRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: VersionControlResult) => void,
  ): ClientUnaryCall;
}

export const DatabaseConnectionClient = makeGenericClientConstructor(
  DatabaseConnectionService,
  "db_connection.DatabaseConnection",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions>): DatabaseConnectionClient;
  service: typeof DatabaseConnectionService;
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
