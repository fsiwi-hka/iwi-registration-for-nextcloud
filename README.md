# registration_Nextcloud

> Registration for the Nextcloud

## Usage

### Local dev

1. Install dependencies: `pip install -r requirements.txt`
2. Run tests: `IWI_API_USERNAME=[USERNAME] -e IWI_API_PASSWORD=[PASSWORD] python3 ./cgi-bin/register_test.py`

   - Run tests in Docker: `docker build -t iwi-python-test ./cgi-bin && docker run --rm -e IWI_API_USERNAME=[USERNAME] -e IWI_API_PASSWORD=[PASSWORD] iwi-python-test`

### Parameters.py

1. To use these scripts you need a parameters.py. You find an example in the cgi directory.
2. Copy, rename, fill and upload - it's done

Have fun.
