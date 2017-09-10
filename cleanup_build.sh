FILES=$(find . -maxdepth 1 -type f)

rm -rf src

for dn in $FILES; do
    if ($dn != 'build')
      echo "Directory $dn will be removed";
      rm -rf $dn;
    done
done

for fn in $FILES; do
    echo "$fn will be removed";
    rm $fn;
done

mv ./build/* .
rm -d ./build
