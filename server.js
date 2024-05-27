const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000; // Use Render's provided port or default to 3000

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.headers);
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self';"
    );
    next();
});

function random(val) {
    return Math.floor(Math.random() * val);
}

function Algo(j, tch, val, box, k, i) {
    let cls = cls_ava(tch, val, random);
    let v = 0;
    if (j === 0) {
        tch[cls] = 1;
        return cls;
    } else if (j > 0) {
        if (check(box, cls)) {
            tch[cls] = 1;
            return cls;
        } else {
            while (!check(box, cls)) {
                
                cls = cls_ava(tch, val, random);
                v++;
                if(v > val ){
                    console.log("infinite loop")
                     break;

                }
            }
            tch[cls] = 1;
            return cls;
        }
    }
}

function cls_ava(tch, val, random) {
    const attempted = new Set();
    const totalClasses = tch.length;
    let v = 0;
    while (attempted.size < val && attempted.size < totalClasses) {
        
        const cls = random(totalClasses);
        if (!attempted.has(cls)) {
            attempted.add(cls);
            if (tch[cls] === 0) {
                return cls;
            }
        }

        v++;
        if(v > val){
            console.log("Infinite Loop in cls_ava");
            break;
        }
    }

    for (let i = 0; i < totalClasses; i++) {
        if (tch[i] === 0 && !attempted.has(i)) {
            return i;
        }
    }

    return -1;
}

function check(box, cl_n) {
    return !box.includes(cl_n);
}

function rotate2DArrayInside3DArrayClockwise(arr3D, layerIndex) {
    const layer = arr3D[layerIndex];
    const rotatedLayer = [];

    for (let i = 0; i < layer[0].length; i++) {
        rotatedLayer.push([]);
        for (let j = 0; j < layer.length; j++) {
            rotatedLayer[i].push(layer[j][i]);
        }
    }

    for (let i = 0; i < rotatedLayer.length; i++) {
        rotatedLayer[i].reverse();
    }

    arr3D[layerIndex] = rotatedLayer;
}

function generateRoutine(sec, days, cls, val) {
    return new Promise((resolve) => {
        console.time('generateRoutine');

        let z = 0;
        let section = [];
        let check_sec = [];


        const tch = Array(val).fill(0);

        for (let i = 0; i < sec; i++) {
            let arr = [];
            for (let j = 0; j < cls; j++) {
                let dayArr = [];
                for (let k = 0; k < days; k++) {
                    dayArr.push(z);
                    z++;
                }
                arr.push(dayArr);
            }
            section.push(arr);
        }

        for (let i = 0; i < sec; i++) {
            let arr1 = [];
            for (let j = 0; j < cls; j++) {
                let dayArr1 = [];
                for (let k = 0; k < days; k++) {
                    dayArr1.push(-1);
                }
                arr1.push(dayArr1);
            }
            check_sec.push(arr1);
        }

        const generate = () => {
            for (let i = 0; i < days; i++) {
                for (let j = 0; j < cls; j++) {
                    for (let k = 0; k < sec; k++) {
                        let box = [];
                        if (j > 0) {
                            for (let c = j - 1; c >= 0; c--) {
                                box.push(check_sec[k][c][i]);
                            }
                        }

                        let t = Algo(j, tch, val, box, k, i);
                        section[k][j][i] = t;
                        check_sec[k][j][i] = t;
                    }
                    tch.fill(0);
                }
            }

            for (let i = 0; i < sec; i++) {
                rotate2DArrayInside3DArrayClockwise(section, i);
            }

            console.timeEnd('generateRoutine');
            console.log('out');
            resolve(section);
        };

        setImmediate(generate);
    });
}

app.post('/', async (req, res) => {
    console.log('Request received');
    const { sec, days, cls, val } = req.body; // Extract sec, days, and cls from the request body
    console.log(sec,days,cls,val)
    console.time('processRequest');
    const processedData = await generateRoutine(sec, days, cls); // Pass the values to the routine generator
    console.timeEnd('processRequest');
    res.json(processedData);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
