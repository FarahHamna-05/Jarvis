'use client';

import { Card, CardContent } from '@/components/base-ui/card';
import {
  HiLightBulb,
  HiShieldCheck,
  HiSupport,
  HiDatabase,
  HiSwitchHorizontal,
} from 'react-icons/hi';

export default function Features1() {
  return (
    <div className="theme-injected flex w-full flex-col items-center justify-center px-6 py-16">
      <h1 className="mb-12 max-w-3xl text-center text-3xl leading-[0.98] font-semibold text-slate-900 md:text-5xl">
        Send and receive money anytime, anywhere
      </h1>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-slate-50/80 rounded-3xl ring-0 border border-slate-200/80 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <CardContent className="p-6">
            <div className="bg-slate-100 mb-2 size-fit rounded-lg p-px">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 shadow-[inset_0_-2px_0.5px_0px_rgba(0,0,0,0),inset_0px_2px_0_2px_rgba(255,255,255,1),0_0px_6px_0_rgba(0,0,0,0.07),0_2px_4px_0_rgba(0,0,0,0.05)]">
                <HiLightBulb className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Smart issue detection</h3>
            <p className="text-slate-500 mb-3 text-sm">
              Identify and resolve payment issues instantly with intelligent
              monitoring.
            </p>
            <div className="bg-slate-100 inline-flex rounded-lg p-0.5">
              <div className="text-slate-600 inline-flex items-center rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium shadow-[inset_0_-2px_0.5px_0px_rgba(0,0,0,0),inset_0px_2px_0_2px_rgba(255,255,255,1),0_0px_2px_0_rgba(0,0,0,0.08),0_1px_4px_0_rgba(0,0,0,0.05)]">
                Real-time alerts
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-50/80 rounded-3xl ring-0 border border-slate-200/80 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <CardContent className="p-6">
            <div className="bg-slate-100 mb-2 size-fit rounded-lg p-px">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 shadow-[inset_0_-2px_0.5px_0px_rgba(0,0,0,0),inset_0px_2px_0_2px_rgba(255,255,255,1),0_0px_6px_0_rgba(0,0,0,0.07),0_2px_4px_0_rgba(0,0,0,0.05)]">
                <HiDatabase className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <h3 className="mb-1 text-lg font-semibold text-slate-900">Fast transactions</h3>
            <p className="text-slate-500 mb-3 text-sm">
              Experience smooth and quick transfers with minimal delays.
            </p>
            <div className="bg-slate-100 inline-flex rounded-lg p-0.5">
              <div className="text-slate-600 inline-flex items-center rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium shadow-[inset_0_-2px_0.5px_0px_rgba(0,0,0,0),inset_0px_2px_0_2px_rgba(255,255,255,1),0_0px_2px_0_rgba(0,0,0,0.08),0_1px_4px_0_rgba(0,0,0,0.05)]">
                Avg speed &lt; 1.5s
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-50/80 row-span-2 flex flex-col justify-between rounded-3xl ring-0 border border-slate-200/80 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="bg-slate-100 mb-3 size-fit rounded-lg p-px">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 shadow-[inset_0_-2px_0.5px_0px_rgba(0,0,0,0),inset_0px_2px_0_2px_rgba(255,255,255,1),0_0px_6px_0_rgba(0,0,0,0.07),0_2px_4px_0_rgba(0,0,0,0.05)]">
                <HiShieldCheck className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Secure & reliable payments
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
              Built with strong encryption and continuous monitoring to keep
              every transaction safe and smooth.
            </p>

            <div className="space-y-3">
              <div className="bg-slate-100 flex items-center justify-between rounded-md px-3 py-2 text-xs">
                <span className="text-slate-500">Encryption</span>
                <span className="font-semibold text-slate-800">AES-256</span>
              </div>
              <div className="bg-slate-100 flex items-center justify-between rounded-md px-3 py-2 text-xs">
                <span className="text-slate-500">Fraud detection</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
              <div className="bg-slate-100 flex items-center justify-between rounded-md px-3 py-2 text-xs">
                <span className="text-slate-500">Uptime</span>
                <span className="font-semibold text-slate-800">99.99%</span>
              </div>
            </div>
          </CardContent>

          <div className="px-6 pb-6">
            <div className="bg-slate-100 inline-flex rounded-lg p-0.5">
              <div className="text-slate-600 inline-flex items-center rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium shadow-[inset_0_-2px_0.5px_0px_rgba(0,0,0,0),inset_0px_2px_0_2px_rgba(255,255,255,1),0_0px_2px_0_rgba(0,0,0,0.08),0_1px_4px_0_rgba(0,0,0,0.05)]">
                Monitored continuously
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-50/80 rounded-3xl ring-0 border border-slate-200/80 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <CardContent className="p-6">
            <div className="bg-slate-100 mb-2 size-fit rounded-lg p-px">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 shadow-[inset_0_-2px_0.5px_0px_rgba(0,0,0,0),inset_0px_2px_0_2px_rgba(255,255,255,1),0_0px_6px_0_rgba(0,0,0,0.07),0_2px_4px_0_rgba(0,0,0,0.05)]">
                <HiSwitchHorizontal className="h-5 w-5 text-pink-500" />
              </div>
            </div>
            <h3 className="mb-1 text-lg font-semibold text-slate-900">Effortless transfers</h3>
            <p className="text-slate-500 mb-3 text-sm">
              Move money between accounts instantly with a seamless experience.
            </p>
            <div className="bg-slate-100 inline-flex rounded-lg p-0.5">
              <div className="text-slate-600 inline-flex items-center rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium shadow-[inset_0_-2px_0.5px_0px_rgba(0,0,0,0),inset_0px_2px_0_2px_rgba(255,255,255,1),0_0px_2px_0_rgba(0,0,0,0.08),0_1px_4px_0_rgba(0,0,0,0.05)]">
                No hidden delays
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-50/80 rounded-3xl ring-0 border border-slate-200/80 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <CardContent className="p-6">
            <div className="bg-slate-100 mb-2 size-fit rounded-lg p-px">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 shadow-[inset_0_-2px_0.5px_0px_rgba(0,0,0,0),inset_0px_2px_0_2px_rgba(255,255,255,1),0_0px_6px_0_rgba(0,0,0,0.07),0_2px_4px_0_rgba(0,0,0,0.05)]">
                <HiSupport className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <h3 className="mb-1 text-lg font-semibold text-slate-900">Always-on support</h3>
            <p className="text-slate-500 mb-3 text-sm">
              Get assistance anytime with responsive and reliable customer help.
            </p>
            <div className="bg-slate-100 inline-flex rounded-lg p-0.5">
              <div className="text-slate-600 inline-flex items-center rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium shadow-[inset_0_-2px_0.5px_0px_rgba(0,0,0,0),inset_0px_2px_0_2px_rgba(255,255,255,1),0_0px_2px_0_rgba(0,0,0,0.08),0_1px_4px_0_rgba(0,0,0,0.05)]">
                24/7 availability
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
