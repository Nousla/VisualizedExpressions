import { EncodeService } from './encode.service'

describe('EncodeService', () =>{
    let service: EncodeService;
    var testUrl: string;
    var encodedUrl: string
    var decodedUrl: string;

    beforeEach(() => { service = new EncodeService(); });

    // Encode tests
    it('#encode empty string', () => {
        testUrl = "";
        encodedUrl = service.encodeURL(testUrl);

        expect(encodedUrl).toEqual(null);
    });
    
    it('#encode string with no symbols', () => {
        testUrl = "abcdefg123";
        encodedUrl = service.encodeURL(testUrl);
        
        expect(encodedUrl).toEqual("abcdefg123");
    });

    it('#encode string with symbols, but not special symbols', () => {
        testUrl = "#@¤{}";
        encodedUrl = service.encodeURL(testUrl);

        expect(encodedUrl).toEqual("%23%40%C2%A4%7B%7D");
    });

    it('#encode string with only special symbols', () => {
        testUrl = "-_.!~*'()";
        encodedUrl = service.encodeURL(testUrl);

        expect(encodedUrl).toEqual("$0$1$2$3$4$5$6$7$8");
    });

    it('#encode string with mixed character, symbols and special symbols', () => {
        testUrl = "Dette er en test! {}";
        encodedUrl = service.encodeURL(testUrl);

        expect(encodedUrl).toEqual("Dette%20er%20en%20test$3%20%7B%7D");
    });

    //Decode tests
    it('#decode empty string', () => {
        testUrl = "";
        decodedUrl = service.decodeURL(testUrl);

        expect(decodedUrl).toEqual(null);
    });
    
    it('#decode string with no symbols', () => {
        testUrl = "abcdefg123";
        decodedUrl = service.decodeURL(testUrl);
        
        expect(decodedUrl).toEqual("abcdefg123");
    });

    it('#decode string with symbols, but not special symbols', () => {
        testUrl = "%23%40%C2%A4%7B%7D";
        decodedUrl = service.decodeURL(testUrl);

        expect(decodedUrl).toEqual("#@¤{}");
    });

    it('#decode string with only special symbols', () => {
        testUrl = "$0$1$2$3$4$5$6$7$8";
        decodedUrl = service.decodeURL(testUrl);

        expect(decodedUrl).toEqual("-_.!~*'()");
    });

    it('#decode string with mixed character, symbols and special symbols', () => {
        testUrl = "Dette%20er%20en%20test$3%20%7B%7D";
        decodedUrl = service.decodeURL(testUrl);

        expect(decodedUrl).toEqual("Dette er en test! {}");
    });


});