import pandas as pd
from django.core.management.base import BaseCommand
from api.models import MarketPrice

class Command(BaseCommand):
    help = "Import market prices from an Excel file"

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str, help= r"C:\Users\Njunji\Downloads\Market Prices Search.xls")

    def handle(self, *args, **kwargs):
        file_path = kwargs["file_path"]

        try:
            df = pd.read_excel(file_path)

            for _, row in df.iterrows():
                # Skip empty rows
                if pd.isnull(row["Commodity"]) or pd.isnull(row["Wholesale"]) or pd.isnull(row["Retail"]):
                    continue

                # Ensure price is numeric
                try:
                    wholesale = row["Wholesale"]
                    retail = row["Retail"]
                except ValueError:
                    self.stdout.write(self.style.WARNING(
                        f"Skipping invalid price: {row['Wholesale']} {row['Retail']}"
                    ))
                    continue

                # Prevent duplicates
                if MarketPrice.objects.filter(commodity=row["Commodity"], date=row["Date"]).exists():
                    self.stdout.write(self.style.WARNING(
                        f"Skipping duplicate entry for {row['Commodity']} on {row['Date']}"
                    ))
                    continue

                # Save to database
                MarketPrice.objects.create(
                    commodity=row["Commodity"],
                    wholesale=wholesale,
                    retail=retail,
                    county=row["County"],
                    date=pd.to_datetime(row["Date"]).date(),
                )

            self.stdout.write(self.style.SUCCESS("Data imported successfully!"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
