import { encodeState, decodeState } from "@root/plugins/helpers/auth";
const sampleHash = "#access_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkRvcXhYX29PV2czNEM0WE14Wjg5QSJ9.eyJpc3MiOiJodHRwczovL2RldmJvc3MudXMuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYwNDI3NWNlNTc5N2RjMDA2ODhhMGE4OCIsImF1ZCI6WyJodHRwczovL2RldmJvc3MvdjEvYXV0aG9yaXplIiwiaHR0cHM6Ly9kZXZib3NzLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2MTY2MjUzNzYsImV4cCI6MTYxNjYzMjU3NiwiYXpwIjoidnB1TnpQZk1yUDNvVllsVExFWlIwdDVRNmlnNExKOWgiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwicGVybWlzc2lvbnMiOltdfQ.xGyeard1WtW7KHlFbDPzdTajlyXsSearU02mP6_1W-Z1Ff_ZkhIM0WakeUmGXWo2tBhPD1JItvTvz2UvDxPmRZsKTaldOXRjz-eZCUC5tH-Ek99XzWCiiaQtuQq4cnxukVc8ppPr6LgUCecIFXuS5IUtPpyn-Zt4DUVNgzM-BuL_btBR3oCYoHn5RWbkCt2SGLv_JCbAKLuT4Ti8H5zmu9VTd8WU1SWOlYkgbnayjTx0DYM78O6tj9-Y-cUeS6RK-rAcwUHAp0xzBKTpbqCthA_VM9aMRA4myUkkfydlm0Z7BkivTo_dQBEmji-EaFO_2SaZ1F3pmODEdgS7om_OEg&scope=openid%20profile%20email&expires_in=7200&token_type=Bearer";

const urls = [
  "/",
  "/learn",
  "/learn/build-fast-websites/",
  "/learn/build-fast-websites/javasript",
  "/learn/build-fast-websites/main-thread",
  "/learn/build-fast-websites/the-dom",
  "/learn/build-fast-websites/the-dom/",
  "/learn/build-fast-websites/painting-render-tree"
]
for (const url of urls) {
  describe("Perform checks on the URL", () => {
    const encodedUrl = encodeState(url);
    it("Should encode a url", () => {
      expect(encodedUrl);
    })
    it("Should decode a url", () => {
      // expects an object with a hash key which contains stuff
      let urlNotEncodedProperly = "L2xlYXJuL2J1aWxkLWZhc3Qtd2Vic2l0ZXMvamF2YXNjcmlwdA%3D%3D";
      let state = { hash: sampleHash + "&state=" + encodedUrl }
      // let state = { hash: sampleHash + "&state=L2xlYXJuL2J1aWxkLWZhc3Qtd2Vic2l0ZXMvamF2YXNjcmlwdA%3D%3D" }
      const decodedUrl = decodeState(state);
      expect(decodedUrl === url);
    })
  })
}