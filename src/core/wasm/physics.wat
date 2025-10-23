 (module 
    ;; import Math utils from JS env (or any othe env)
    (func $MATH_RANDOM (import "Math" "random") (result f32))
    (func $MATH_SIN (import "Math" "sin") (param f32) (result f32))
    (func $MATH_COS (import "Math" "cos") (param f32) (result f32))


    (memory (export "mem") 1) 

    (global $len (mut i32) (i32.const 0))

    (func $RESIZE_MEMORY
        (local $needBlocks i32)


        (local.set $needBlocks
            (i32.shr_u 
                (i32.add 
                    (global.get $len)
                    (i32.const 0xFFFF)
                )
                (i32.const 16)
            )
        )

        (if
            (i32.gt_u (local.get $needBlocks) (memory.size))
            (then
                (drop 
                    (memory.grow 
                        (i32.sub 
                            (local.get $needBlocks) 
                            (memory.size)
                        )
                    )
                )
            )
        )
    )

    (func (export "run") (param $start_x f32) (param $start_y f32)
        (local $pointer i32)
        (local $angle f32)
        (local $amplitude f32)


        (loop $eachpoint
            ;; amplitude = sqrt(random()) * 29
            (local.set $amplitude 
                (f32.mul (f32.sqrt (call $MATH_RANDOM)) (f32.const 29))
            ) 

            ;; angle = random * 2PI    
            (local.set $angle
                (f32.mul (call $MATH_RANDOM) (f32.const 6.2831853071))
            )  


            ;; mem[pointer+0] = x
            (f32.store offset=0 (local.get $pointer)
                (local.get $start_x)
            )

            ;; mem[pointer + 4] = y
            (f32.store offset=4 
                (local.get $pointer)
                (local.get $start_y)
            )  

            ;; mem[pointer + 8] = dx = amplitude * cos(angle)
            (f32.store offset=8 
                (local.get $pointer)
                (f32.mul 
                    (local.get $amplitude)
                    (call $MATH_COS (local.get $angle))
                )
            ) 

            ;; mem[pointer + 12] = dx = amplitude * sin(angle)
            (f32.store offset=12 
                (local.get $pointer)
                (f32.mul 
                    (local.get $amplitude)
                    (call $MATH_SIN (local.get $angle))
                )
            ) 


            ;; pointer += 16
            (local.set $pointer
                (i32.add 
                    (local.get $pointer)
                    (i32.const 16)
                )
            )
            
            ;; if (_ < $len) continue
            (br_if $eachpoint
                (i32.lt_u 
                    (local.get $pointer)
                    (global.get $len)
                )
            )
        )
    )


    (func (export "tick") (param $pointsCount i32)
        (local $pointer i32)
        
        ;; len = pointsCount * 4
        (global.set $len
            (i32.mul 
                (local.get $pointsCount)
                (i32.const 16)
            )
        )


        (call $RESIZE_MEMORY)


        (loop $eachpoint
            ;; mem[ptr + 0] += mem[ptr + 8]
            (f32.store offset=0 
                (local.get $pointer)
                (f32.add 
                    (f32.load offset=0 (local.get $pointer))
                    (f32.load offset=8 (local.get $pointer))
                )
            )

            ;; mem[ptr + 4] += mem[ptr + 12]
            (f32.store offset=4 
                (local.get $pointer)
                (f32.add 
                    (f32.load offset=4 (local.get $pointer))
                    (f32.load offset=12 (local.get $pointer))
                )
            )

            ;; mem[ptr + 12] += 0.25
            (f32.store offset=12 
                (local.get $pointer)
                (f32.add 
                    (f32.load offset=12 (local.get $pointer))
                    (f32.const 0.05)
                )
            )


             ;; pointer += 16
            (local.set $pointer
                (i32.add 
                    (local.get $pointer)
                    (i32.const 16)
                )
            )
            
            ;; if (_ < $len) continue
            (br_if $eachpoint
                (i32.lt_u 
                    (local.get $pointer)
                    (global.get $len)
                )
            )
        )
    )
 )