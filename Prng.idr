module Prng

import Data.List.Views.Extra

dropTill : Nat -> List a -> List a
dropTill x xs =
  case x >= length xs of
       True => xs
       False => go x xs
where
  go : Nat -> List a -> List a
  go target ls with (vList ls)
    go target [] | VNil = []
    go 0 [x] | VOne = []
    go (S k) [x] | VOne = [x]
    go target w@(x :: (xs ++ [y])) | (VCons rec) =
      let l = length xs in
      case (target == S (S l), target == S l) of
           (True, _) => w
           (_, True) => (x :: xs)
           (_, False) => go target xs

middleSquare : Nat -> Nat -> Nat
middleSquare origLength k =
  let sq = k * k
      str = the String (cast sq)
      ls = unpack str
  in cast $ pack $ dropTill origLength ls

xRandoms : Nat -> Nat -> List Nat
xRandoms seed k =
  let origLength = length (the String $ cast seed) in
    go origLength seed k
where
  go : Nat -> Nat -> Nat -> List Nat
  go origLength seed 0 = [seed]
  go origLength seed (S k) =
    let new = (middleSquare origLength seed) in
      seed :: go origLength new k
