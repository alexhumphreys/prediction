module Util

import Promise
import PG.Postgres
import TyTTP.Adapter.Node.HTTP

import Debug.Trace

public export
try : ((us : List Universe) -> (RowU us) -> Maybe z)
    -> (us : List Universe ** List (Row (RowTypes us))) -> Maybe (List z)
try f (fst ** []) = Just []
try f (fst ** (y :: xs)) = Just $ !(f fst y) :: !(try f (fst ** xs))

%foreign """
node:lambda: () => {
  const { Pool, Client } = require('pg')
  const pool = new Pool(
  {
    user: 'postgres',
    host: '127.0.0.1',
    database: 'foo',
    password: 'admin',
    port: 5432,
  }
  )
  return pool
}
"""
prim__get_pool_ : PrimIO Pool

-- for querying
export
getPool' : HasIO io => io Pool
getPool' = primIO $ prim__get_pool_

%foreign """
node:lambda: (str) => { return {message: str, code: str, stack:""} }
"""
prim__from_string : String -> IO NodeError

-- TODO many many hacks
export
FromString NodeError where
  fromString x = unsafePerformIO $ prim__from_string x

%foreign "javascript:lambda: (a,i)=>setInterval(a,i)"
prim__setInterval : PrimIO () -> Int32 -> PrimIO ()

export
setInterval : (HasIO io) => IO () -> Int32 -> io ()
setInterval a i = primIO $ prim__setInterval (toPrim a) i
