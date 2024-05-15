export default function unserialize(data: string): any {


    const read_until = (data: string, offset: number, stopchr: string): [number, string] => {
        const buf: string[] = [];
        let chr = data.slice(offset, offset + 1);
        let i = 2;
        while (chr !== stopchr) {
            if (i + offset > data.length) {
                console.error('Error', 'Invalid');
            }
            buf.push(chr);
            chr = data.slice(offset + (i - 1), offset + i);
            i += 1;
        }
        return [buf.length, buf.join('')];
    };

    const read_chrs = (data: string, offset: number, length: number): [number, string] => {
        const buf: string[] = [];
        for (let i = 0; i < length; i++) {
            const chr = data.slice(offset + (i - 1), offset + i);
            buf.push(chr);
        }
        return [buf.length, buf.join('')];
    };

    const _unserialize = (data: string, offset: number = 0): any => {
        let buf: string[] = [];
        const dtype = data.slice(offset, offset + 1).toLowerCase();

        let dataoffset : number | string = offset + 2;
        let typeconvert = (x: any) => x;
        let chrs : number | string = 0;
        let datalength = 0;
        let readdata : any = 0;
        switch (dtype) {
            case 'i':
                typeconvert = (x: any) => parseInt(x);
                const [intChrs, intData] = read_until(data, dataoffset, ';');
                chrs = intChrs;
                readdata = intData;
                dataoffset += chrs + 1;
                break;
            case 'b':
                typeconvert = (x: any) => parseInt(x) === 1;
                const [boolChrs, boolData] = read_until(data, dataoffset, ';');
                chrs = boolChrs;
                readdata = boolData;
                dataoffset += chrs + 1;
                break;
            case 'd':
                typeconvert = (x: any) => parseFloat(x);
                const [floatChrs, floatData] = read_until(data, dataoffset, ';');
                chrs = floatChrs;
                readdata = floatData;
                dataoffset += chrs + 1;
                break;
            case 'n':
                readdata = null;
                break;
            case 's':
                const [countData, countChrs] : [countData: any, countChrs : any] = read_until(data, dataoffset, ':');
                chrs = countChrs;
                const stringlength = parseInt(countData);
                dataoffset += Number(chrs) + 2;

                const [stringData, stringChrs] = read_chrs(data, dataoffset + 1, stringlength);
                chrs = stringChrs;
                readdata = stringData;
                dataoffset += Number(chrs) + 2;
                if (Number(chrs) !== stringlength && chrs !== readdata.length) {
                    console.error('SyntaxError', 'String length mismatch');
                }
                break;
            case 'a':
                readdata = {};

                const [keyData, keyChrs] = read_until(data, dataoffset, ':');
                chrs = keyChrs;
                const keys = keyData;
                dataoffset += Number(chrs) + 2;

                for (let i = 0; i < parseInt(String(keys)); i++) {
                    const kprops = _unserialize(data, dataoffset);
                    const kchrs = kprops[1];
                    const key = kprops[2];
                    dataoffset += kchrs;

                    const vprops = _unserialize(data, dataoffset);
                    const vchrs = vprops[1];
                    const value = vprops[2];
                    dataoffset += vchrs;

                    readdata[key] = value;
                }

                dataoffset += 1;
                break;
            default:
                console.error('SyntaxError', `Unknown / Unhandled data type(s): ${dtype}`);
                break;
        }

        return typeconvert(readdata);
    };

    return _unserialize(data, 0);
}
