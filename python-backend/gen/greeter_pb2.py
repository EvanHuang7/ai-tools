# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: greeter.proto
# Protobuf Python Version: 5.29.0
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    29,
    0,
    '',
    'greeter.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\rgreeter.proto\x12\x07greeter\"\x1c\n\x0cHelloRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\" \n\rHelloResponse\x12\x0f\n\x07message\x18\x01 \x01(\t2K\n\x0eGreeterService\x12\x39\n\x08SayHello\x12\x15.greeter.HelloRequest\x1a\x16.greeter.HelloResponseB\x13Z\x11./greeter;greeterb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'greeter_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  _globals['DESCRIPTOR']._loaded_options = None
  _globals['DESCRIPTOR']._serialized_options = b'Z\021./greeter;greeter'
  _globals['_HELLOREQUEST']._serialized_start=26
  _globals['_HELLOREQUEST']._serialized_end=54
  _globals['_HELLORESPONSE']._serialized_start=56
  _globals['_HELLORESPONSE']._serialized_end=88
  _globals['_GREETERSERVICE']._serialized_start=90
  _globals['_GREETERSERVICE']._serialized_end=165
# @@protoc_insertion_point(module_scope)
