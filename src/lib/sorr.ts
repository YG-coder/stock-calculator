export interface SorrResult { balances: number[]; terminal: number; depletedYear: number | null; }
export function parseAnnualReturns(text:string):number[]{return text.split(/[,\s]+/).filter(Boolean).map(Number).map(v=>v/100)}
export function simulateSorr(initial:number,monthlyWithdrawal:number,inflation:number,returns:number[]):SorrResult{
  let balance=initial; const balances=[balance]; let depletedYear:number|null=null;
  for(let year=0;year<returns.length;year++){
    const annualWithdrawal=monthlyWithdrawal*12*Math.pow(1+inflation,year);
    balance-=annualWithdrawal;
    if(balance<=0){balance=0;depletedYear=year+1;balances.push(0);for(let y=year+1;y<returns.length;y++)balances.push(0);break}
    balance*=1+returns[year]; if(balance<=0){balance=0;depletedYear=year+1}
    balances.push(balance); if(depletedYear){for(let y=year+1;y<returns.length;y++)balances.push(0);break}
  }
  return {balances,terminal:balance,depletedYear};
}
