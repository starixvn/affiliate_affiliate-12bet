export class HeaderColumn {
    constructor(key, text, width) {
        this.key = key;
        this.text = text;
        this.width = width;
    }

    get isShowable() {
        return true;
    }
}

export class SingleHeaderColumn extends HeaderColumn {
    constructor(key, text, showable, width) {
        super(key, text, width);
        this.showable = showable;
    }

    get isShowable() {
        return this.showable;
    }
}

export class AggregateHeaderColumn extends HeaderColumn {
    constructor(key, text, childHeader, width) {
        super(key, text, width);
        this.childHeader = childHeader;
    }

    static getCols(headerAggregate) {
        let cells = [];
        headerAggregate.childHeader.forEach(item => {
            if (item instanceof AggregateHeaderColumn) {
                cells.push(...AggregateHeaderColumn.getCols(item));
            }
            else {
                cells.push(item);
            }
        });

        return cells;
    }

    static convertColsToObject(cols) {
        let obj = {};
        cols.forEach(col => {
            if (col instanceof HeaderColumn) {
                obj[col.key] = col;
            }
        });

        return obj;
    }

    getCols = () => AggregateHeaderColumn.getCols(this);

    isShowableHeader = (key) => {
        let cols = this.getCols();
        let found = cols.find(item => item.key === key && item.isShowable);
        return !!found;
    }

    get isShowable() {
        return !!this.childHeader.find(el => el.isShowable);
    }

    get totalRow() {
        if (!this.isShowable) return 0;

        let maxChildRow = this.childHeader.reduce((maxRow, item) => {
            if (item instanceof AggregateHeaderColumn && item.isShowable) {
                return Math.max(maxRow, item.totalRow);
            }
            return maxRow;
        }, 1);

        return 1 + maxChildRow;
    }

    get totalShowableCol() {
        return this.childHeader.filter(item => item.isShowable).length;
    }
}

export class HeaderRow extends AggregateHeaderColumn {
    constructor(headerCols, width) {
        super('', '', headerCols, width);
    }

    getHeaderCols = (depth) => {
        if (depth > this.totalRow - 1) {
            return [];
        }

        let currentDepth = 0;
        let currentCols = this.childHeader;
        while (currentDepth < depth) {
            let nextDepthCols = [];
            currentCols.forEach(col => {
                if (col instanceof AggregateHeaderColumn) {
                    nextDepthCols.push(...col.childHeader);
                }
            });

            currentCols = nextDepthCols;
            currentDepth++;
        }

        return currentCols;
    }

    get totalRow() {
        if (!this.isShowable) return 0;

        return this.childHeader.reduce((maxRow, item) =>
            Math.max(maxRow, item instanceof AggregateHeaderColumn ? item.totalRow : 1), 0);
    }
}