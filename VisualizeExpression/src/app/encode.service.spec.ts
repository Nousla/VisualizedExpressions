import { EncodeService } from './encode.service';

describe('EncodeService', () =>{
    let service: EncodeService;

    beforeEach(() => { service = new EncodeService(); });

    // Encode tests
    it('#encode empty string', () => {
        var testUrl = "";
        var encodedUrl = service.encodeURL(testUrl);

        expect(encodedUrl).toEqual(null);
    });
    
    it('#encode string with no symbols', () => {
        var testUrl = "abcdefg123";
        var encodedUrl = service.encodeURL(testUrl);
        
        expect(encodedUrl).toEqual("abcdefg123");
    });

    it('#encode string with symbols, but not special symbols', () => {
        var testUrl = "#@¤{}";
        var encodedUrl = service.encodeURL(testUrl);

        expect(encodedUrl).toEqual("%23%40%C2%A4%7B%7D");
    });

    it('#encode string with only special symbols', () => {
        var testUrl = "-_.!~*'()";
        var encodedUrl = service.encodeURL(testUrl);

        expect(encodedUrl).toEqual("$0$1$2$3$4$5$6$7$8");
    });

    it('#encode string with mixed character, symbols and special symbols', () => {
       var testUrl = "Dette er en test! {}";
       var encodedUrl = service.encodeURL(testUrl);

        expect(encodedUrl).toEqual("Dette%20er%20en%20test$3%20%7B%7D");
    });

    //Decode tests
    it('#decode empty string', () => {
        var testUrl = "";
        var decodedUrl = service.decodeURL(testUrl);

        expect(decodedUrl).toEqual(null);
    });
    
    it('#decode string with no symbols', () => {
        var testUrl = "abcdefg123";
        var decodedUrl = service.decodeURL(testUrl);
        
        expect(decodedUrl).toEqual("abcdefg123");
    });

    it('#decode string with symbols, but not special symbols', () => {
        var testUrl = "%23%40%C2%A4%7B%7D";
        var decodedUrl = service.decodeURL(testUrl);

        expect(decodedUrl).toEqual("#@¤{}");
    });

    it('#decode string with only special symbols', () => {
        var testUrl = "$0$1$2$3$4$5$6$7$8";
        var decodedUrl = service.decodeURL(testUrl);

        expect(decodedUrl).toEqual("-_.!~*'()");
    });

    it('#decode string with mixed character, symbols and special symbols', () => {
        var testUrl = "Dette%20er%20en%20test$3%20%7B%7D";
        var decodedUrl = service.decodeURL(testUrl);

        expect(decodedUrl).toEqual("Dette er en test! {}");
    });


});