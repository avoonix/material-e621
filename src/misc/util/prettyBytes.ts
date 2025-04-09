export function prettyBytes(value: number) {
    if (!Number.isFinite(value)) {
        throw new TypeError(`Expected a finite number, got ${typeof value}: ${value}`);
    }

    const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const isNegative = value < 0;
    if (isNegative) value = -value;

    if (value < 1) return (isNegative ? '-' : '') + value + ' B';

    const exponent = Math.min(Math.floor(Math.log10(value) / 3), UNITS.length - 1);
    const num = (value / (1000 ** exponent)).toPrecision(3);

    return (isNegative ? '-' : '') + num + ' ' + UNITS[exponent];
}
