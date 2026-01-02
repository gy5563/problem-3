const getPriority = (blockchain: string): number => {
    switch (blockchain) {
        case 'Osmosis': return 100
        case 'Ethereum': return 50
        case 'Arbitrum': return 30
        case 'Zilliqa': return 20
        case 'Neo': return 20
        default: return -99
    }
}

const WalletPage: React.FC<Props> = (props: Props) => {
    const { ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const sortedBalances = useMemo(() => {
        return balances
        .filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            return balancePriority > -99 && balance.amount > 0;
        })
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            }
                return 0;
        });
    }, [balances]);


    const rows = sortedBalances.map((balance: WalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    const formatted = balance.amount.toFixed();
 
    return (
        <WalletRow
            className={classes.row}
            key={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={formatted}
        />
    )
    })

    return (
        <div {...rest}>
        {rows}
        </div>
    )
}