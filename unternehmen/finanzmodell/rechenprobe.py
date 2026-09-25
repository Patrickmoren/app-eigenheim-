# -*- coding: utf-8 -*-
"""Rechenprobe: rechnet das Basisszenario unabhängig in Python nach und
vergleicht mit den Formelergebnissen der Arbeitsmappe (Umsatz, EBITDA, Kasse)."""
import warnings; warnings.filterwarnings("ignore")
import math
from auswerten import werte

def ru(x):  # Excel ROUND
    return math.floor(x + 0.5) if x >= 0 else -math.floor(-x + 0.5)
def ruup(x, n=1):
    k = 10 ** n; return math.ceil(x * k - 1e-9) / k

miete, hon, hon_u, stwe, zus, churn, halb = 1485, .034, .04, 480, .22, .05, .5
org_m=[250,700,1200,1600,2000]; org_s=[150,450,800,1100,1400]
ueb_m=[700,1300,1800,2200,2500]; ueb_s=[300,600,900,1100,1300]
prod=[400,440,480,520,560]; ass=[.6,.55,.5,.45,.4]; gl=[330e3,650e3,1e6,1.35e6,1.65e6]
fix=[70e3,95e3,130e3,160e3,190e3]; ek=[750e3,1.8e6,0,0,0]; kr=[200e3,500e3,600e3,1e6,1.2e6]
mult, bar, vd, earn, integ, gw, zins, kl, st = 1, .5, .3, .2, .08, 8, .055, 5, .197

em=es=0; kasse=0; kred=0; vds=0; kp_hist=[]; vd_hist=[]; kr_hist=[]
erg=[]
for i in range(5):
    zm, zs = org_m[i]+ueb_m[i], org_s[i]+ueb_s[i]
    am, as_ = -ru(em*churn), -ru(es*churn)
    avm, avs = em+(zm+am)*halb, es+(zs+as_)*halb
    em, es = em+zm+am, es+zs+as_
    u = (avm*miete*12*hon + avs*stwe)*(1+zus)
    fb = ruup((avm+avs*.6)/prod[i]); fa = ru(fb*ass[i]*10)/10
    ueb_u = ueb_m[i]*miete*12*hon_u*(1+zus) + ueb_s[i]*stwe*(1+zus)
    kp = ueb_u*mult; kp_hist.append(kp)
    fte = fb+fa+ru(gl[i]/150000)
    kosten = fb*118000+fa*88000+gl[i]+(avm+avs)*22+(org_m[i]*260+org_s[i]*160)+fte*9000+fix[i]+kp*integ
    ebitda = u-kosten
    zinsen = -(kred+vds)*zins
    ebt = ebitda - sum(kp_hist)/gw + zinsen
    steuern = -max(0, ebt)*st
    vdt = sum(x*vd for x in kp_hist[max(0,i-3):i])/3 if i else 0
    earn_f = kp_hist[i-1]*earn if i else 0
    krt = -sum(kr[:i])/kl if i else 0
    kasse += ebitda+zinsen+steuern-(kp*bar+earn_f)-vdt+kr[i]+krt+ek[i]
    vds += kp*vd - vdt; kred += kr[i]+krt
    erg.append((u, ebitda, kasse))

w = werte()
fehler = 0
for k, (name, idx) in enumerate([("Umsatz",0),("EBITDA",1),("Liquide Mittel Jahresende",2)]):
    for i in range(5):
        a, b = w[name][i], erg[i][idx]
        ok = abs(a-b) < 1
        fehler += not ok
        print(f"{name:28s} {2027+i}  Excel {a:>14,.0f}  Python {b:>14,.0f}  {'ok' if ok else 'ABWEICHUNG'}")
print("\nErgebnis:", "alle Werte stimmen überein" if not fehler else f"{fehler} Abweichungen")
