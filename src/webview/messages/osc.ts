import { OscServiceApi } from '../../osc/oscService';

export function handleOscSend(
  params: { address: string; args: any[] },
  deps: { oscService: OscServiceApi | null }
) {
  try {
    deps.oscService?.send(params.address, Array.isArray(params.args) ? params.args : []);
  } catch { /* ignore */ }
}
