import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Node.js環境でTextEncoderとTextDecoderを利用可能にする
Object.assign(global, {
  TextDecoder,
  TextEncoder,
});

// Web API ポリフィル（Nextjsテスト用）
if (!global.Request) {
  global.Request = class Request {
    constructor(public url: string, public options?: RequestInit) {}
  } as unknown as typeof Request;
}

if (!global.Response) {
  global.Response = class Response {
    constructor(public body?: BodyInit, public options?: ResponseInit) {}
    static json(data: unknown) {
      return new Response(JSON.stringify(data));
    }
  } as unknown as typeof Response;
}

// Fetch API のポリフィル
if (!global.fetch) {
  global.fetch = jest.fn();
}

// FormData のポリフィル
if (!global.FormData) {
  global.FormData = class FormData {
    private data: Map<string, string> = new Map();

    append(key: string, value: string) {
      this.data.set(key, value);
    }

    get(key: string): string | null {
      return this.data.get(key) || null;
    }
  } as unknown as typeof FormData;
}
