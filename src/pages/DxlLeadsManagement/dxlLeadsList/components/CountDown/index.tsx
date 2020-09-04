
import React, { Component } from 'react';

export interface CountDownProps {
    cdTime: number;
    id: string;
    statusNum: number
}

interface CountDownState {
    cdTime: number,
    id: string,
    statusNum: number,
}

function fixedZero(val: number) {
    return val * 1 < 10 ? `0${val}` : val;
}

class CountDown extends Component<CountDownProps, CountDownState> {
    timer: any;
    interval: number = 1000;
    constructor(props: CountDownProps) {
        super(props);
        this.state = {
            cdTime: props.cdTime,
            id: props.id,
            statusNum: props.statusNum,
        };
    }


    static getDerivedStateFromProps(nextProps: CountDownProps, preState: CountDownState) {
        const { cdTime, id, statusNum } = nextProps;
        if (preState.id !== id) {
            return {
                cdTime,
                id,
                statusNum,
            };
        }
        return null;
    }

    componentDidMount() {
        this.tick();
    }

    componentDidUpdate(prevProps: CountDownProps) {
        if (prevProps.id != this.props.id) {
            const { cdTime, id, statusNum } = this.props;
            this.state = {
                cdTime: cdTime,
                id: id,
                statusNum: statusNum,
            };
            clearTimeout(this.timer);
            this.tick();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    renderTime = (time: number, h: any, m: any, s: any) => {
        return (
            time >= 30 * 60 * 1000 ?
                <div style={{ color: 'red' }}>
                    <span>
                        {fixedZero(h)}:{fixedZero(m)}:{fixedZero(s)}
                    </span>
                </div>
                :
                <span>
                    {fixedZero(h)}:{fixedZero(m)}:{fixedZero(s)}
                </span>

        );
    }

    renderTimeOut = () => {
        return (
            <div style={{ color: 'red' }}>超时</div>
        );
    }

    renderNotStart = () => {
        return (
            <div>
                {/* 未开始 */}
            </div>
        );
    }

    renderStart = (time: number) => {
        const hours = 60 * 60 * 1000;
        const minutes = 60 * 1000;
        const h = Math.floor(time / hours);
        const m = Math.floor((time - h * hours) / minutes);
        const s = Math.floor((time - h * hours - m * minutes) / 1000);
        return (
            time > 0 ? this.renderTime(time, h, m, s) : this.renderTimeOut()
        );
    }

    format = (time: number, statusNum: number) => {
        return (
            ((statusNum == 1 || statusNum == 2) && time <= 720 * 60 * 1000) ? this.renderStart(time) : this.renderNotStart()
        );
    };

    tick = () => {
        let { cdTime } = this.state;
        this.timer = setTimeout(() => {
            if (cdTime < this.interval) {
                clearTimeout(this.timer);
                this.setState(
                    {
                        cdTime: 0,
                    },
                    () => {

                    }
                );
            } else {
                cdTime -= this.interval;
                this.setState(
                    {
                        cdTime,
                    },
                    () => {
                        this.tick();
                    }
                );
            }
        }, this.interval);
    };

    render() {
        const result = this.format(this.state.cdTime, this.state.statusNum);
        return <span>{result}</span>;
    }
}

export default CountDown;